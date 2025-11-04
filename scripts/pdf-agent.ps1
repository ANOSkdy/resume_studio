param(
  [int]$Port = 7781,
  [string]$TemplateDir,
  [string]$Token = $env:PDF_AGENT_TOKEN
)

# ==== Path resolve ====
if (-not $TemplateDir) {
  $base = if ($PSScriptRoot) { (Resolve-Path (Join-Path $PSScriptRoot '..')).Path } else { (Get-Location).Path }
  $TemplateDir = Join-Path $base 'public\docs'
}
Write-Host ("TemplateDir = {0}" -f $TemplateDir)

# ==== Utils ====
function Normalize-For-Word([string]$text) {
  if ($null -eq $text) { return '' }
  return ($text -replace "`r?`n", '^p')
}
function Get-Field($obj, $name) {
  if ($null -eq $obj) { return $null }
  if ($obj -is [System.Collections.IDictionary]) { return $obj[$name] }
  elseif ($obj -is [pscustomobject]) { return $obj.$name }
  else { return $null }
}

# ==== Replace (Format=true / MatchByte / Replacement.Font=Yu Gothic) ====
function Replace-In-Range($range, $map) {
  $wdFindContinue = 1; $wdReplaceAll = 2
  $find = $range.Find
  $find.ClearFormatting(); $find.Replacement.ClearFormatting()
  $find.MatchCase=$false; $find.MatchWholeWord=$false
  $find.MatchWildcards=$false; $find.MatchSoundsLike=$false
  $find.MatchAllWordForms=$false; $find.Forward=$true
  $find.Wrap=$wdFindContinue; $find.Format=$true
  try { $find.MatchByte = $true } catch {}

  try {
    $rf = $find.Replacement.Font
    $rf.Name        = "Yu Gothic"
    $rf.NameAscii   = "Yu Gothic"
    $rf.NameFarEast = "Yu Gothic"
  } catch {}

  foreach ($k in $map.Keys) {
    $text = "{{" + $k + "}}"; $rep = $map[$k]
    $find.Text = $text; $find.Replacement.Text = $rep
    [void]$find.Execute(
      $text, $false, $false, $false, $false, $false,
      $true, $wdFindContinue, $true,   # Format=$true
      $rep,  $wdReplaceAll
    )
  }
}

# ==== Replace all stories/shapes ====
function Replace-All-Stories($doc, $map) {
  Replace-In-Range -range $doc.Content -map $map
  foreach ($rngStory in $doc.StoryRanges) {
    $r = $rngStory
    while ($null -ne $r) { Replace-In-Range -range $r -map $map; $r = $r.NextStoryRange }
  }
  foreach ($st in 1..11) { try {
    $r = $doc.StoryRanges.Item($st)
    while ($null -ne $r) { Replace-In-Range -range $r -map $map; $r = $r.NextStoryRange }
  } catch {} }
  try { foreach ($s in $doc.Shapes) {
    try { if ($s.TextFrame -and $s.TextFrame.HasText -ne 0) { Replace-In-Range -range $s.TextFrame.TextRange -map $map } } catch {}
  } } catch {}
  try {
    foreach ($sec in $doc.Sections) {
      foreach ($hf in $sec.Headers) { try { foreach ($s in $hf.Shapes) { try { if ($s.TextFrame -and $s.TextFrame.HasText -ne 0) { Replace-In-Range -range $s.TextFrame.TextRange -map $map } } catch {} } } catch {} }
      foreach ($hf in $sec.Footers) { try { foreach ($s in $hf.Shapes) { try { if ($s.TextFrame -and $s.TextFrame.HasText -ne 0) { Replace-In-Range -range $s.TextFrame.TextRange -map $map } } catch {} } } catch {} }
    }
  } catch {}
}

# ==== Force Japanese font/language everywhere ====
function Set-Font($font, $name) {
  try { $font.Name=$name; $font.NameAscii=$name; $font.NameFarEast=$name } catch {}
}
function Apply-Font-To-Shape($sh, $name) {
  try { if ($sh.TextFrame -and $sh.TextFrame.HasText -ne 0) { Set-Font $sh.TextFrame.TextRange.Font $name } } catch {}
  try {
    if ($sh.GroupItems -and $sh.GroupItems.Count -gt 0) {
      foreach ($child in $sh.GroupItems) { Apply-Font-To-Shape $child $name }
    }
  } catch {}
}
function Force-Font-Everywhere($doc, $name) {
  foreach ($rngStory in $doc.StoryRanges) {
    $r = $rngStory
    while ($null -ne $r) { try { Set-Font $r.Font $name } catch {}; $r = $r.NextStoryRange }
  }
  try { foreach ($tb in $doc.Tables) { try { Set-Font $tb.Range.Font $name } catch {} } } catch {}
  try { foreach ($s in $doc.Shapes) { Apply-Font-To-Shape $s $name } } catch {}
  try {
    foreach ($sec in $doc.Sections) {
      foreach ($hf in $sec.Headers) { try {
        foreach ($s in $hf.Shapes) { Apply-Font-To-Shape $s $name }
        foreach ($tb in $hf.Range.Tables) { try { Set-Font $tb.Range.Font $name } catch {} }
      } catch {} }
      foreach ($hf in $sec.Footers) { try {
        foreach ($s in $hf.Shapes) { Apply-Font-To-Shape $s $name }
        foreach ($tb in $hf.Range.Tables) { try { Set-Font $tb.Range.Font $name } catch {} }
      } catch {} }
    }
  } catch {}
}
function Force-Lang-Japanese($doc) {
  $wdJapanese = 1041
  try {
    foreach ($rngStory in $doc.StoryRanges) {
      $r = $rngStory
      while ($null -ne $r) { try { $r.LanguageIDFarEast = $wdJapanese } catch {}; $r = $r.NextStoryRange }
    }
    try { foreach ($tb in $doc.Tables) { try { $tb.Range.LanguageIDFarEast = $wdJapanese } catch {} } } catch {}
    try {
      foreach ($s in $doc.Shapes) { try { if ($s.TextFrame -and $s.TextFrame.HasText -ne 0) { $s.TextFrame.TextRange.LanguageIDFarEast = $wdJapanese } } catch {} }
    } catch {}
  } catch {}
}

# ==== Http server ====
$listener = [System.Net.HttpListener]::new()
$prefix   = "http://127.0.0.1:$Port/"
if (-not $listener.Prefixes.Contains($prefix)) { $listener.Prefixes.Add($prefix) }

try {
  $listener.Start()
  Write-Host ("PDF Agent listening on {0}" -f $prefix)

  while ($listener.IsListening) {
    try { $ctx = $listener.GetContext() }
    catch [System.ObjectDisposedException] { break }
    catch { Start-Sleep -Milliseconds 200; continue }

    $doc = $null; $word = $null
    try {
      if ($ctx.Request.HttpMethod -ne 'POST' -or $ctx.Request.Url.AbsolutePath -ne '/render') { $ctx.Response.StatusCode = 404; $ctx.Response.Close(); continue }
      if ($Token) {
        $auth = $ctx.Request.Headers['Authorization']
        if (-not $auth -or $auth -ne ("Bearer " + $Token)) { $ctx.Response.StatusCode = 401; $ctx.Response.Close(); continue }
      }

      # JSON parse (PS5.1 compatible)
      $reader  = [System.IO.StreamReader]::new($ctx.Request.InputStream, [System.Text.Encoding]::UTF8)
      $raw     = $reader.ReadToEnd(); $reader.Dispose()
      try { $payload = ConvertFrom-Json -InputObject $raw }
      catch { Add-Type -AssemblyName System.Web.Extensions; $js = New-Object System.Web.Script.Serialization.JavaScriptSerializer; $payload = $js.DeserializeObject($raw) }

      $template = Get-Field $payload 'template'; if (-not $template) { $template = 'resume' }; $template = $template.ToString().ToLower()
      $data     = Get-Field $payload 'data';     if (-not $data)     { $data = @{} }

      $map = @{}
      if ($data -is [System.Collections.IDictionary]) { foreach ($entry in $data.GetEnumerator()) { $map[$entry.Key] = Normalize-For-Word $entry.Value } }
      else { foreach ($p in $data.PSObject.Properties) { $map[$p.Name] = Normalize-For-Word $p.Value } }

      # Word replace -> force font/lang -> to PDF
      $docxPath = if ($template -eq 'cv') { Join-Path $TemplateDir 'cv\cv.docx' } else { Join-Path $TemplateDir 'resume\resume.docx' }
      if (-not (Test-Path $docxPath)) { throw ("Template not found: " + $docxPath) }

      $word = New-Object -ComObject Word.Application
      $word.Visible = $false
      $doc = $word.Documents.Open($docxPath)

      Replace-All-Stories -doc $doc -map $map
      Force-Font-Everywhere -doc $doc -name "Yu Gothic"
      Force-Lang-Japanese -doc $doc

      $tmpPdf = Join-Path $env:TEMP ("pdf_" + [guid]::NewGuid().ToString() + ".pdf")
      $wdExportFormatPDF = 17
      $doc.ExportAsFixedFormat($tmpPdf, $wdExportFormatPDF)
      $bytes = [System.IO.File]::ReadAllBytes($tmpPdf)
      Remove-Item $tmpPdf -Force

      $ctx.Response.StatusCode = 200
      $ctx.Response.ContentType = "application/pdf"
      $ctx.Response.AddHeader("Content-Disposition","inline; filename=" + $template + ".pdf")
      $ctx.Response.AddHeader("Cache-Control","no-store")
      $ctx.Response.OutputStream.Write($bytes,0,$bytes.Length)
      $ctx.Response.OutputStream.Close()
    } catch {
      try {
        $msg = $_.Exception.Message
        $ctx.Response.StatusCode = 500
        $ctx.Response.ContentType = "application/json"
        $payloadErr = '{"error":"' + ($msg -replace '"','''') + '"}'
        $errBytes = [System.Text.Encoding]::UTF8.GetBytes($payloadErr)
        $ctx.Response.OutputStream.Write($errBytes,0,$errBytes.Length)
        $ctx.Response.OutputStream.Close()
      } catch {}
    } finally {
      if ($doc)  { try { $doc.Close([ref]0) | Out-Null } catch {} }
      if ($word) { try { $word.Quit()       | Out-Null } catch {} }
    }
  }
}
finally { try { $listener.Stop(); $listener.Close() } catch {} }
