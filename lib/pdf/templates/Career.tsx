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
    gap: 4,
  },
  bulletItem: {
    flexDirection: "row",
    gap: 6,
  },
  bulletSymbol: {
    fontWeight: 700,
  },
  label: {
    fontSize: 9,
    color: "#64748b",
  },
  meta: {
    marginBottom: 8,
  },
});

const CareerTemplate: React.FC<{ data: ResumePdfPayload }> = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{data.name || "職務経歴書"}</Text>
          <Text style={styles.subtitle}>{data.generated_cv_summary || data.q1_cv}</Text>
        </View>

        <View style={styles.meta}>
          <Text style={styles.label}>連絡先</Text>
          <Text style={styles.paragraph}>{`${data.phone} / ${data.email}`.trim()}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>サマリー</Text>
          <Text style={styles.paragraph}>{data.generated_cv_summary || data.q1_cv || "-"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>職務経歴</Text>
          <Text style={styles.paragraph}>{data.generated_cv_details || data.q2_cv || "-"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>スキル</Text>
          {data.generated_cv_skills ? (
            <View style={styles.bulletList}>
              {data.generated_cv_skills
                .split(/\n+/)
                .map(line => line.trim())
                .filter(Boolean)
                .map((line, index) => (
                  <View key={`skill-${index}`} style={styles.bulletItem}>
                    <Text style={styles.bulletSymbol}>•</Text>
                    <Text style={styles.paragraph}>{line}</Text>
                  </View>
                ))}
            </View>
          ) : (
            <Text style={styles.paragraph}>{data.q3_cv || "-"}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>自己PR</Text>
          <Text style={styles.paragraph}>{data.generated_cv_pr || data.q4_cv || data.q5_cv || "-"}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default CareerTemplate;
