import React from "react";
import { Document, Page, View, StyleSheet } from "@react-pdf/renderer";
import type { ResumePdfPayload } from "../schema";
import { SafeText, t } from "../SafeText";

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: "Noto Sans JP",
    fontSize: 11,
    lineHeight: 1.5,
    color: "#111111",
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
    borderBottomStyle: "solid",
    paddingBottom: 12,
    marginBottom: 18,
  },
  name: {
    fontSize: 20,
    fontWeight: 700,
  },
  kana: {
    fontSize: 10,
    color: "#6b7280",
  },
  twoColumn: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  column: {
    flexDirection: "column",
    flex: 1,
    paddingRight: 8,
  },
  columnRight: {
    paddingRight: 0,
    paddingLeft: 8,
  },
  label: {
    fontSize: 9,
    color: "#6b7280",
  },
  value: {
    fontSize: 11,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#2563eb",
    borderLeftStyle: "solid",
    paddingLeft: 6,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 4,
  },
  listDate: {
    width: 72,
    fontSize: 10,
    color: "#374151",
    marginRight: 8,
  },
  listBody: {
    flex: 1,
    fontSize: 11,
    marginLeft: 0,
  },
  paragraph: {
    fontSize: 11,
    marginBottom: 6,
  },
});

const EMPTY = "-";

function toText(value: unknown, fallback = ""): string {
  const raw = t(value).trim();
  return raw.length > 0 ? raw : fallback;
}

const logSection = (section: string): null => {
  console.info(`[pdf][resume] section=${section}`);
  return null;
};

function formatDate(year: unknown, month: unknown) {
  const y = t(toText(year)).trim();
  const m = t(toText(month)).trim();
  if (!y && !m) return EMPTY;
  if (!y) return `${m}月`;
  if (!m) return `${y}年`;
  return `${y}年${m}月`;
}

function formatAddress(postal: string | undefined, address: string | undefined) {
  const postalText = toText(postal);
  const addressText = toText(address);
  const line = `${postalText ? `〒${postalText} ` : ""}${addressText}`.trim();
  return line || EMPTY;
}

const InfoRow = ({ label, value }: { label: string; value: unknown }) => {
  const text = toText(value, EMPTY);
  return (
    <View style={{ marginBottom: 4 }}>
      <SafeText style={styles.label}>{t(label)}</SafeText>
      <SafeText style={styles.value}>{t(text || EMPTY)}</SafeText>
    </View>
  );
};

const ParagraphBlock = ({ title, value }: { title: string; value: unknown }) => {
  const text = toText(value, EMPTY) || EMPTY;
  return (
    <View style={styles.section}>
      <SafeText style={styles.sectionTitle}>{t(title)}</SafeText>
      <SafeText style={styles.paragraph}>{t(text)}</SafeText>
    </View>
  );
};

const ResumeTemplate: React.FC<{ data: ResumePdfPayload }> = ({ data }) => {
  const currentPostal = toText(data.address_postal_code);
  const currentAddress = toText(data.address_main);
  const contactPostal = toText(
    data.same_as_current_address ? data.address_postal_code : data.contact_address_postal_code,
  );
  const contactAddress = toText(
    data.same_as_current_address ? data.address_main : data.contact_address_main,
  );
  const contactPhone = toText(data.same_as_current_address ? data.phone : data.contact_phone);
  const contactEmail = toText(data.same_as_current_address ? data.email : data.contact_email);

  const historyItems = Array.isArray(data.history) ? data.history : [];
  const qualificationItems = Array.isArray(data.qualifications) ? data.qualifications : [];

  const resumePr = toText(data.generated_resume_pr) || toText(data.q3_resume);

  console.info("[pdf][resume] section=HEADER");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <SafeText style={styles.name}>{t(toText(data.name, "氏名未設定"))}</SafeText>
          <SafeText style={styles.kana}>{t(toText(data.name_furigana))}</SafeText>
        </View>

        {logSection("PROFILE")}
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <InfoRow label="生年月日" value={data.birth_date} />
            <InfoRow label="性別" value={data.gender} />
            <InfoRow label="現住所" value={formatAddress(currentPostal, currentAddress)} />
          </View>
          <View style={[styles.column, styles.columnRight]}>
            <InfoRow label="電話" value={data.phone} />
            <InfoRow label="メール" value={data.email} />
            <InfoRow label="連絡先" value={formatAddress(contactPostal, contactAddress)} />
            <InfoRow label="連絡先電話" value={contactPhone} />
            <InfoRow label="連絡先メール" value={contactEmail} />
          </View>
        </View>

        {logSection("HISTORY")}
        <View style={styles.section}>
          <SafeText style={styles.sectionTitle}>{t("学歴・職歴")}</SafeText>
          {historyItems.length === 0 ? (
            <SafeText style={styles.paragraph}>{t(EMPTY)}</SafeText>
          ) : (
            historyItems.map((entry, index) => {
              const descText = toText(entry?.desc);
              const statusText = toText(entry?.status);
              const bodyText = `${descText}${statusText ? `（${statusText}）` : ""}`.trim();
              return (
                <View key={`history-${index}`} style={styles.listItem}>
                  <SafeText style={styles.listDate}>{t(formatDate(entry?.year, entry?.month))}</SafeText>
                  <SafeText style={styles.listBody}>{t(bodyText || EMPTY)}</SafeText>
                </View>
              );
            })
          )}
        </View>

        {logSection("QUALIFICATIONS")}
        <View style={styles.section}>
          <SafeText style={styles.sectionTitle}>{t("資格・免許")}</SafeText>
          {qualificationItems.length === 0 ? (
            <SafeText style={styles.paragraph}>{t(EMPTY)}</SafeText>
          ) : (
            qualificationItems.map((entry, index) => {
              const descText = toText(entry?.desc);
              return (
                <View key={`qualification-${index}`} style={styles.listItem}>
                  <SafeText style={styles.listDate}>{t(formatDate(entry?.year, entry?.month))}</SafeText>
                  <SafeText style={styles.listBody}>{t(descText || EMPTY)}</SafeText>
                </View>
              );
            })
          )}
        </View>

        {logSection("ESSAYS")}
        <ParagraphBlock title="志望動機" value={data.q1_resume} />
        <ParagraphBlock title="長所・短所" value={data.q2_resume} />
        <ParagraphBlock title="自己PR" value={resumePr} />
        <ParagraphBlock title="通勤時間・最寄り駅" value={data.q4_resume} />
        <ParagraphBlock title="扶養家族・配偶者" value={data.q5_resume} />
        <ParagraphBlock title="特記事項" value={data.special_requests} />
      </Page>
    </Document>
  );
};

export default ResumeTemplate;
