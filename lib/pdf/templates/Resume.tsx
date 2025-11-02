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
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : fallback;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    const joined = value.map(item => toText(item, "")).filter(Boolean).join(" ");
    return joined || fallback;
  }
  return fallback;
}

function formatDate(year: unknown, month: unknown) {
  const y = toText(year);
  const m = toText(month);
  if (!y && !m) return EMPTY;
  if (!y) return `${m}月`;
  if (!m) return `${y}年`;
  return `${y}年${m}月`;
}

function formatAddress(postal: string, address: string) {
  const line = `${postal ? `〒${postal} ` : ""}${address}`.trim();
  return line || EMPTY;
}

const InfoRow = ({ label, value }: { label: string; value: unknown }) => {
  const text = toText(value, EMPTY);
  return (
    <View style={{ marginBottom: 4 }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{text || EMPTY}</Text>
    </View>
  );
};

const ParagraphBlock = ({ title, value }: { title: string; value: unknown }) => {
  const text = toText(value, EMPTY) || EMPTY;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.paragraph}>{text}</Text>
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{toText(data.name, "氏名未設定")}</Text>
          <Text style={styles.kana}>{toText(data.name_furigana)}</Text>
        </View>

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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>学歴・職歴</Text>
          {historyItems.length === 0 ? (
            <Text style={styles.paragraph}>{EMPTY}</Text>
          ) : (
            historyItems.map((entry, index) => {
              const descText = toText(entry?.desc);
              const statusText = toText(entry?.status);
              const bodyText = `${descText}${statusText ? `（${statusText}）` : ""}`.trim();
              return (
                <View key={`history-${index}`} style={styles.listItem}>
                  <Text style={styles.listDate}>{formatDate(entry?.year, entry?.month)}</Text>
                  <Text style={styles.listBody}>{bodyText || EMPTY}</Text>
                </View>
              );
            })
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>資格・免許</Text>
          {qualificationItems.length === 0 ? (
            <Text style={styles.paragraph}>{EMPTY}</Text>
          ) : (
            qualificationItems.map((entry, index) => {
              const descText = toText(entry?.desc);
              return (
                <View key={`qualification-${index}`} style={styles.listItem}>
                  <Text style={styles.listDate}>{formatDate(entry?.year, entry?.month)}</Text>
                  <Text style={styles.listBody}>{descText || EMPTY}</Text>
                </View>
              );
            })
          )}
        </View>

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
