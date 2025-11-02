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
  const raw = t(value).trim();
  return raw.length > 0 ? raw : fallback;
}

const logSection = (section: string): null => {
  console.info(`[pdf][career] section=${section}`);
  return null;
};

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

  console.info("[pdf][career] section=HEADER");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <SafeText style={styles.title}>{t(nameText)}</SafeText>
          <SafeText style={styles.subtitle}>{t(summaryText || EMPTY)}</SafeText>
        </View>

        {logSection("CONTACT")}
        <View style={styles.meta}>
          <SafeText style={styles.label}>{t("連絡先")}</SafeText>
          <SafeText style={styles.paragraph}>
            {t(`${phoneText}${phoneText && emailText ? " / " : ""}${emailText}` || EMPTY)}
          </SafeText>
        </View>

        {logSection("SUMMARY")}
        <View style={styles.section}>
          <SafeText style={styles.sectionTitle}>{t("サマリー")}</SafeText>
          <SafeText style={styles.paragraph}>{t(summaryText || EMPTY)}</SafeText>
        </View>

        {logSection("HISTORY")}
        <View style={styles.section}>
          <SafeText style={styles.sectionTitle}>{t("職務経歴")}</SafeText>
          <SafeText style={styles.paragraph}>{t(detailsText || EMPTY)}</SafeText>
        </View>

        {logSection("SKILLS")}
        <View style={styles.section}>
          <SafeText style={styles.sectionTitle}>{t("スキル")}</SafeText>
          {skillLines.length > 0 ? (
            <View style={styles.bulletList}>
              {skillLines.map((line, index) => (
                <View key={`skill-${index}`} style={styles.bulletItem}>
                  <SafeText style={styles.bulletSymbol}>{t("•")}</SafeText>
                  <SafeText style={styles.paragraph}>{t(line)}</SafeText>
                </View>
              ))}
            </View>
          ) : (
            <SafeText style={styles.paragraph}>{t(fallbackSkills)}</SafeText>
          )}
        </View>

        {logSection("PR")}
        <View style={styles.section}>
          <SafeText style={styles.sectionTitle}>{t("自己PR")}</SafeText>
          <SafeText style={styles.paragraph}>{t(prText)}</SafeText>
        </View>
      </Page>
    </Document>
  );
};

export default CareerTemplate;
