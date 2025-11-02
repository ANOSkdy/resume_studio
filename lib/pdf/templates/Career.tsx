import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ResumePdfPayload } from "../schema";

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: "Noto Sans JP",
    fontSize: 11,
    lineHeight: 1.5,
    color: "#0f172a",
  },
  header: {
    marginBottom: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: "#64748b",
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 6,
    color: "#1d4ed8",
  },
  paragraph: {
    fontSize: 11,
    marginBottom: 6,
  },
  bulletList: {
    marginLeft: 12,
    flexDirection: "column",
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 4,
  },
  bulletSymbol: {
    fontWeight: 700,
    marginRight: 6,
  },
  label: {
    fontSize: 9,
    color: "#64748b",
  },
  meta: {
    marginBottom: 8,
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

const CareerTemplate: React.FC<{ data: ResumePdfPayload }> = ({ data }) => {
  const nameText = toText(data.name, "職務経歴書");
  const summaryText = toText(data.generated_cv_summary) || toText(data.q1_cv);
  const detailsText = toText(data.generated_cv_details) || toText(data.q2_cv);
  const skillsText = toText(data.generated_cv_skills);
  const fallbackSkills = toText(data.q3_cv, EMPTY) || EMPTY;
  const prText = toText(data.generated_cv_pr) || toText(data.q4_cv) || toText(data.q5_cv, EMPTY) || EMPTY;
  const phoneText = toText(data.phone);
  const emailText = toText(data.email);

  const skillLines = skillsText
    ? skillsText
        .split(/\n+/)
        .map(line => toText(line))
        .filter(Boolean)
    : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{nameText}</Text>
          <Text style={styles.subtitle}>{summaryText || EMPTY}</Text>
        </View>

        <View style={styles.meta}>
          <Text style={styles.label}>連絡先</Text>
          <Text style={styles.paragraph}>{`${phoneText}${phoneText && emailText ? " / " : ""}${emailText}` || EMPTY}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>サマリー</Text>
          <Text style={styles.paragraph}>{summaryText || EMPTY}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>職務経歴</Text>
          <Text style={styles.paragraph}>{detailsText || EMPTY}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>スキル</Text>
          {skillLines.length > 0 ? (
            <View style={styles.bulletList}>
              {skillLines.map((line, index) => (
                <View key={`skill-${index}`} style={styles.bulletItem}>
                  <Text style={styles.bulletSymbol}>•</Text>
                  <Text style={styles.paragraph}>{line}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.paragraph}>{fallbackSkills}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>自己PR</Text>
          <Text style={styles.paragraph}>{prText}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default CareerTemplate;
