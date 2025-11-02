import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ResumePdfPayload } from "../schema";

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
    gap: 12,
    marginBottom: 16,
  },
  column: {
    flexDirection: "column",
    flex: 1,
    gap: 6,
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
    gap: 8,
    marginBottom: 4,
  },
  listDate: {
    width: 72,
    fontSize: 10,
    color: "#374151",
  },
  listBody: {
    flex: 1,
    fontSize: 11,
  },
  paragraph: {
    fontSize: 11,
    marginBottom: 6,
  },
});

const EMPTY = "-";

function formatDate(year: string, month: string) {
  const y = year?.trim();
  const m = month?.trim();
  if (!y && !m) return EMPTY;
  if (!y) return `${m}月`;
  if (!m) return `${y}年`;
  return `${y}年${m}月`;
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={{ marginBottom: 4 }}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || EMPTY}</Text>
  </View>
);

const ParagraphBlock = ({ title, value }: { title: string; value: string }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.paragraph}>{value || EMPTY}</Text>
  </View>
);

const ResumeTemplate: React.FC<{ data: ResumePdfPayload }> = ({ data }) => {
  const contactAddress = data.same_as_current_address
    ? data.address_main
    : data.contact_address_main;
  const contactPostal = data.same_as_current_address
    ? data.address_postal_code
    : data.contact_address_postal_code;
  const contactPhone = data.same_as_current_address ? data.phone : data.contact_phone;
  const contactEmail = data.same_as_current_address ? data.email : data.contact_email;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{data.name || "氏名未設定"}</Text>
          <Text style={styles.kana}>{data.name_furigana}</Text>
        </View>

        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <InfoRow label="生年月日" value={data.birth_date} />
            <InfoRow label="性別" value={data.gender} />
            <InfoRow
              label="現住所"
              value={`${data.address_postal_code ? `〒${data.address_postal_code} ` : ""}${data.address_main}`.trim()}
            />
          </View>
          <View style={styles.column}>
            <InfoRow label="電話" value={data.phone} />
            <InfoRow label="メール" value={data.email} />
            <InfoRow
              label="連絡先"
              value={`${contactPostal ? `〒${contactPostal} ` : ""}${contactAddress}`.trim()}
            />
            <InfoRow label="連絡先電話" value={contactPhone} />
            <InfoRow label="連絡先メール" value={contactEmail} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>学歴・職歴</Text>
          {data.history.length === 0 ? (
            <Text style={styles.paragraph}>{EMPTY}</Text>
          ) : (
            data.history.map((entry, index) => (
              <View key={`history-${index}`} style={styles.listItem}>
                <Text style={styles.listDate}>{formatDate(entry.year, entry.month)}</Text>
                <Text style={styles.listBody}>
                  {`${entry.desc}${entry.status ? `（${entry.status}）` : ""}`.trim() || EMPTY}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>資格・免許</Text>
          {data.qualifications.length === 0 ? (
            <Text style={styles.paragraph}>{EMPTY}</Text>
          ) : (
            data.qualifications.map((entry, index) => (
              <View key={`qualification-${index}`} style={styles.listItem}>
                <Text style={styles.listDate}>{formatDate(entry.year, entry.month)}</Text>
                <Text style={styles.listBody}>{entry.desc || EMPTY}</Text>
              </View>
            ))
          )}
        </View>

        <ParagraphBlock title="志望動機" value={data.q1_resume} />
        <ParagraphBlock title="長所・短所" value={data.q2_resume} />
        <ParagraphBlock title="自己PR" value={data.generated_resume_pr || data.q3_resume} />
        <ParagraphBlock title="通勤時間・最寄り駅" value={data.q4_resume} />
        <ParagraphBlock title="扶養家族・配偶者" value={data.q5_resume} />
        <ParagraphBlock title="特記事項" value={data.special_requests} />
      </Page>
    </Document>
  );
};

export default ResumeTemplate;
