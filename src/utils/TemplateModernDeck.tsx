import React from 'react';
import { Page, Text, View, StyleSheet, Image, Link, Font } from '@react-pdf/renderer';
import { ResumeData } from '../types';

// Assuming we want to share some basic styles from pdfTemplates
const baseStyles = StyleSheet.create({
  page: { flexDirection: 'column', display: 'flex', backgroundColor: '#FFFFFF', paddingBottom: 40, height: 'auto', flexGrow: 1, justifyContent: 'flex-start', alignItems: 'stretch' },
  sectionWrap: { marginBottom: 15 }
});

const RenderSkills = ({ data, headerStyle, color = '#334155' }: { data: ResumeData, headerStyle?: any, color?: string }) => (
  <View style={headerStyle?.marginBottom ? { marginBottom: headerStyle.marginBottom } : { marginBottom: 15 }} wrap={false}>
    <Text style={{ ...headerStyle, color, marginBottom: headerStyle?.paddingBottom ? headerStyle.marginBottom : 10 }} minPresenceAhead={100}>SKILLS</Text>
    {data.skills?.coreExpertise && data.skills.coreExpertise.length > 0 && (
      <View style={{ marginBottom: 4 }}>
        <Text style={{ fontSize: 9, fontFamily: headerStyle?.fontFamily === 'Times-Bold' ? 'Times-Bold' : (headerStyle?.fontFamily === 'Courier-Bold' ? 'Courier-Bold' : 'Helvetica-Bold') }}>Core: <Text style={{ fontFamily: headerStyle?.fontFamily === 'Times-Bold' ? 'Times-Roman' : (headerStyle?.fontFamily === 'Courier-Bold' ? 'Courier' : 'Helvetica') }}>{data.skills.coreExpertise.join(', ')}</Text></Text>
      </View>
    )}
    {data.skills?.technicalTools && data.skills.technicalTools.length > 0 && (
      <View style={{ marginBottom: 4 }}>
        <Text style={{ fontSize: 9, fontFamily: headerStyle?.fontFamily === 'Times-Bold' ? 'Times-Bold' : (headerStyle?.fontFamily === 'Courier-Bold' ? 'Courier-Bold' : 'Helvetica-Bold') }}>Tools: <Text style={{ fontFamily: headerStyle?.fontFamily === 'Times-Bold' ? 'Times-Roman' : (headerStyle?.fontFamily === 'Courier-Bold' ? 'Courier' : 'Helvetica') }}>{data.skills.technicalTools.join(', ')}</Text></Text>
      </View>
    )}
  </View>
);

// 1. Modern Navy Sidebar
export const ModernNavySidebar = ({ data }: { data: ResumeData }) => (
  <Page wrap={true} size="A4" style={{ flexDirection: 'row', backgroundColor: '#ffffff', paddingBottom: 40, height: 'auto', flexGrow: 1, justifyContent: 'flex-start', alignItems: 'stretch' }}>
    <View style={{ width: '30%', backgroundColor: '#1e3a8a', padding: 20, color: 'white' }}>
      {data.preferences?.showPhoto !== false && data.profileImageBase64 ? (
        <Image src={data.profileImageBase64} style={{ width: 90, height: 90, borderRadius: 45, marginBottom: 15, alignSelf: 'center', objectFit: 'cover' }} />
      ) : (
        <View style={{ width: 90, height: 90, borderRadius: 45, backgroundColor: '#3b82f6', marginBottom: 15, alignSelf: 'center' }} />
      )}
      <Text style={{ fontSize: 18, fontFamily: 'Helvetica-Bold', marginBottom: 5, textAlign: 'center' }}>{data.contactInfo.fullName}</Text>
      <Text style={{ fontSize: 10, marginBottom: 20, textAlign: 'center', color: '#bfdbfe' }}>{data.contactInfo.targetTitle}</Text>
      
      <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 5, color: '#93c5fd' }}>CONTACT</Text>
      <Text style={{ fontSize: 8, marginBottom: 3 }}>{data.contactInfo.email}</Text>
      <Text style={{ fontSize: 8, marginBottom: 3 }}>{data.contactInfo.phone}</Text>
      <Text style={{ fontSize: 8, marginBottom: 3 }}>{data.contactInfo.location}</Text>
      {data.linkedinUrl && <Text style={{ fontSize: 8, marginBottom: 3 }}>{data.linkedinUrl}</Text>}

      <View style={{ marginTop: 20 }}>
        <RenderSkills data={data} headerStyle={{ fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 10 }} color="#93c5fd" />
      </View>
    </View>
    
    <View style={{ width: '70%', padding: 30, backgroundColor: '#ffffff' }}>
      <Text style={{ fontSize: 10, lineHeight: 1.4, marginBottom: 20, color: '#334155' }}>{data.professionalSummary}</Text>
      <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#1e3a8a', borderBottom: 2, borderColor: '#bfdbfe', paddingBottom: 5, marginBottom: 10 }} minPresenceAhead={100}>EXPERIENCE</Text>
      {(data.workExperience || []).map((w, i) => (
        <View key={i} style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#1e293b' }} wrap={false}>{w.roleTitle}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
            <Text style={{ fontSize: 10, color: '#475569' }}>{w.company} | {w.location}</Text>
            <Text style={{ fontSize: 9, color: '#64748b' }}>{w.dates}</Text>
          </View>
          {(w.bullets || []).map((h, j) => (
            <Text key={j} style={{ fontSize: 9, marginBottom: 3, color: '#334155', lineHeight: 1.4 }}>• {h}</Text>
          ))}
        </View>
      ))}

      <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#1e3a8a', borderBottom: 2, borderColor: '#bfdbfe', paddingBottom: 5, marginBottom: 10, marginTop: 10 }} minPresenceAhead={100}>EDUCATION</Text>
      {(data.education || []).map((e, i) => (
        <View key={i} style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#1e293b' }} wrap={false}>{e.institution}</Text>
          <Text style={{ fontSize: 10, color: '#475569' }}>{e.degree} ({e.graduationYear})</Text>
        </View>
      ))}
    </View>
  </Page>
);

// 2. Creative Teal Split
export const CreativeTealSplit = ({ data }: { data: ResumeData }) => (
  <Page wrap={true} size="A4" style={{ ...baseStyles.page, padding: 0 }}>
    <View style={{ backgroundColor: '#0f766e', padding: 25, color: 'white', minHeight: '60px' }}>
      <Text style={{ fontSize: 24, fontFamily: 'Helvetica-Bold' }}>{data.contactInfo.fullName}</Text>
      <Text style={{ fontSize: 12, marginTop: 5, color: '#ccfbf1' }}>{data.contactInfo.targetTitle}</Text>
      <View style={{ flexDirection: 'row', gap: 15, marginTop: 10, flexWrap: 'wrap' }}>
        <Text style={{ fontSize: 9 }}>{data.contactInfo.email}</Text>
        <Text style={{ fontSize: 9 }}>{data.contactInfo.phone}</Text>
        <Text style={{ fontSize: 9 }}>{data.contactInfo.location}</Text>
      </View>
    </View>
    <View style={{ padding: 30, flexDirection: 'row' }}>
      <View style={{ width: '65%', paddingRight: 20 }}>
        <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#0f766e', marginBottom: 15 }} minPresenceAhead={100}>EXPERIENCE</Text>
        {(data.workExperience || []).map((w, i) => (
          <View key={i} style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold' }} wrap={false}>{w.roleTitle}</Text>
            <Text style={{ fontSize: 10, color: '#115e59', marginBottom: 5 }}>{w.company} | {w.dates}</Text>
            {(w.bullets || []).map((h, j) => (
              <Text key={j} style={{ fontSize: 9, marginBottom: 3, color: '#333', lineHeight: 1.4 }}>• {h}</Text>
            ))}
          </View>
        ))}
      </View>
      <View style={{ width: '35%', borderLeft: 2, borderColor: '#ccfbf1', paddingLeft: 20 }}>
        <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#0f766e', marginBottom: 15 }} minPresenceAhead={100}>ABOUT</Text>
        <Text style={{ fontSize: 9, marginBottom: 20, lineHeight: 1.4 }}>{data.professionalSummary}</Text>
        <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#0f766e', marginBottom: 15 }} minPresenceAhead={100}>EDUCATION</Text>
        {(data.education || []).map((e, i) => (
          <View key={i} style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold' }} wrap={false}>{e.institution}</Text>
            <Text style={{ fontSize: 9 }}>{e.degree}</Text>
            <Text style={{ fontSize: 9, color: '#475569' }}>{e.graduationYear}</Text>
          </View>
        ))}
        <RenderSkills data={data} headerStyle={{ fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#0f766e', marginBottom: 15, marginTop: 10 }} color="#0f766e" />
      </View>
    </View>
  </Page>
);

// 3. Executive Gold Accent
export const ExecutiveGoldAccent = ({ data }: { data: ResumeData }) => (
  <Page wrap={true} size="A4" style={{ ...baseStyles.page, padding: 40 }}>
    <View style={{ borderBottom: 1, borderColor: '#d4af37', paddingBottom: 20, marginBottom: 20 }}>
      <Text style={{ fontSize: 26, fontFamily: 'Times-Bold', color: '#1c1c1c' }}>{data.contactInfo.fullName}</Text>
      <Text style={{ fontSize: 14, fontFamily: 'Times-Italic', color: '#d4af37', marginTop: 4 }}>{data.contactInfo.targetTitle}</Text>
      <View style={{ flexDirection: 'row', gap: 15, marginTop: 10 }}>
        <Text style={{ fontSize: 9, color: '#4a4a4a' }}>{data.contactInfo.email}</Text>
        <Text style={{ fontSize: 9, color: '#4a4a4a' }}>{data.contactInfo.phone}</Text>
        <Text style={{ fontSize: 9, color: '#4a4a4a' }}>{data.contactInfo.location}</Text>
      </View>
    </View>
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 10, fontFamily: 'Times-Roman', lineHeight: 1.5, color: '#333' }}>{data.professionalSummary}</Text>
    </View>
    <Text style={{ fontSize: 14, fontFamily: 'Times-Bold', color: '#1c1c1c', borderBottom: 1, borderColor: '#eee', paddingBottom: 5, marginBottom: 15 }} minPresenceAhead={100}>PROFESSIONAL TENURE</Text>
    {(data.workExperience || []).map((w, i) => (
      <View key={i} style={{ marginBottom: 15 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} wrap={false}>
          <Text style={{ fontSize: 12, fontFamily: 'Times-Bold', color: '#1c1c1c' }}>{w.roleTitle}</Text>
          <Text style={{ fontSize: 10, fontFamily: 'Times-Italic', color: '#d4af37' }}>{w.dates}</Text>
        </View>
        <Text style={{ fontSize: 11, fontFamily: 'Times-Italic', color: '#4a4a4a', marginBottom: 5 }}>{w.company} – {w.location}</Text>
        {(w.bullets || []).map((h, j) => (
          <Text key={j} style={{ fontSize: 10, fontFamily: 'Times-Roman', color: '#333', marginBottom: 4, lineHeight: 1.4 }}>• {h}</Text>
        ))}
      </View>
    ))}
    <Text style={{ fontSize: 14, fontFamily: 'Times-Bold', color: '#1c1c1c', borderBottom: 1, borderColor: '#eee', paddingBottom: 5, marginBottom: 15, marginTop: 10 }} minPresenceAhead={100}>ACADEMIC BACKGROUND</Text>
    {(data.education || []).map((e, i) => (
      <View key={i} style={{ marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
        <View wrap={false}>
          <Text style={{ fontSize: 11, fontFamily: 'Times-Bold' }}>{e.institution}</Text>
          <Text style={{ fontSize: 10 }}>{e.degree}</Text>
        </View>
        <Text style={{ fontSize: 10 }}>{e.graduationYear}</Text>
      </View>
    ))}
  </Page>
);

// 4. Emerald Tech Grid
export const EmeraldTechGrid = ({ data }: { data: ResumeData }) => (
  <Page wrap={true} size="A4" style={{ ...baseStyles.page, padding: 30, backgroundColor: '#f0fdf4' }}>
    <View style={{ flexDirection: 'row', borderBottom: 3, borderColor: '#15803d', paddingBottom: 15, marginBottom: 20 }}>
      <View style={{ width: '70%' }}>
        <Text style={{ fontSize: 24, fontFamily: 'Helvetica-Bold', color: '#14532d' }}>{data.contactInfo.fullName}</Text>
        <Text style={{ fontSize: 12, color: '#16a34a', marginTop: 4, fontFamily: 'Helvetica-Bold' }}>{data.contactInfo.targetTitle}</Text>
      </View>
      <View style={{ width: '30%', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
        <Text style={{ fontSize: 9, color: '#166534', marginBottom: 2 }}>{data.contactInfo.phone}</Text>
        <Text style={{ fontSize: 9, color: '#166534', marginBottom: 2 }}>{data.contactInfo.email}</Text>
      </View>
    </View>
    <View style={{ flexDirection: 'row' }}>
      <View style={{ width: '30%', paddingRight: 15, borderRight: 1, borderColor: '#bbf7d0' }}>
        <RenderSkills data={data} headerStyle={{ fontSize: 12, fontFamily: 'Helvetica-Bold', marginBottom: 10, color: '#14532d' }} color="#14532d" />
        <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', marginTop: 15, marginBottom: 10, color: '#14532d' }} minPresenceAhead={100}>EDUCATION</Text>
        {(data.education || []).map((e, i) => (
          <View key={i} style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#166534' }} wrap={false}>{e.degree}</Text>
            <Text style={{ fontSize: 9, color: '#14532d', marginTop: 2 }}>{e.institution}</Text>
            <Text style={{ fontSize: 8, color: '#16a34a', marginTop: 2 }}>{e.graduationYear}</Text>
          </View>
        ))}
      </View>
      <View style={{ width: '70%', paddingLeft: 15 }}>
        <Text style={{ fontSize: 10, lineHeight: 1.4, color: '#14532d', marginBottom: 15 }}>{data.professionalSummary}</Text>
        <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#15803d', marginBottom: 10 }} minPresenceAhead={100}>EXPERIENCE</Text>
        {(data.workExperience || []).map((w, i) => (
          <View key={i} style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#14532d' }} wrap={false}>{w.roleTitle}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
              <Text style={{ fontSize: 9, color: '#16a34a', fontFamily: 'Helvetica-Bold' }}>{w.company}</Text>
              <Text style={{ fontSize: 9, color: '#166534' }}>{w.dates}</Text>
            </View>
            <View style={{ borderLeft: 2, borderColor: '#bbf7d0', paddingLeft: 10, marginTop: 5 }}>
              {(w.bullets || []).map((h, j) => (
                <Text key={j} style={{ fontSize: 9, color: '#14532d', marginBottom: 4, lineHeight: 1.4 }}>{h}</Text>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  </Page>
);

// Helper for the remaining 8 templates dynamically based on base structure
const ColorBlockTemplate = ({ data, mainColor, accentColor, bgColor }: any) => (
  <Page wrap={true} size="A4" style={{ ...baseStyles.page, padding: 30, backgroundColor: bgColor }}>
    <View style={{ alignItems: 'center', marginBottom: 20 }}>
      <Text style={{ fontSize: 28, fontFamily: 'Helvetica-Bold', color: mainColor }}>{data.contactInfo.fullName}</Text>
      <Text style={{ fontSize: 14, color: accentColor, marginTop: 4 }}>{data.contactInfo.targetTitle}</Text>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
        <Text style={{ fontSize: 9, color: mainColor }}>{data.contactInfo.email}</Text>
        <Text style={{ fontSize: 9, color: mainColor }}>|</Text>
        <Text style={{ fontSize: 9, color: mainColor }}>{data.contactInfo.phone}</Text>
        <Text style={{ fontSize: 9, color: mainColor }}>|</Text>
        <Text style={{ fontSize: 9, color: mainColor }}>{data.contactInfo.location}</Text>
      </View>
    </View>
    <View style={{ marginBottom: 20, padding: 15, backgroundColor: '#ffffff', borderLeft: 4, borderColor: accentColor }}>
      <Text style={{ fontSize: 10, lineHeight: 1.4, color: '#333' }}>{data.professionalSummary}</Text>
    </View>
    <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: mainColor, borderBottom: 2, borderColor: accentColor, paddingBottom: 5, marginBottom: 15 }} minPresenceAhead={100}>EXPERIENCE</Text>
    {(data.workExperience || []).map((w: any, i: number) => (
      <View key={i} style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} wrap={false}>
          <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: mainColor }}>{w.roleTitle}</Text>
          <Text style={{ fontSize: 10, color: accentColor }}>{w.dates}</Text>
        </View>
        <Text style={{ fontSize: 10, color: '#555', marginBottom: 5 }}>{w.company} – {w.location}</Text>
        {(w.bullets || []).map((h: string, j: number) => (
          <Text key={j} style={{ fontSize: 9, color: '#444', marginBottom: 3, lineHeight: 1.4 }}>• {h}</Text>
        ))}
      </View>
    ))}
    <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: mainColor, borderBottom: 2, borderColor: accentColor, paddingBottom: 5, marginBottom: 15, marginTop: 10 }} minPresenceAhead={100}>EDUCATION</Text>
    {(data.education || []).map((e: any, i: number) => (
      <View key={i} style={{ marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
        <View wrap={false}>
          <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: mainColor }}>{e.institution}</Text>
          <Text style={{ fontSize: 10, color: '#555' }}>{e.degree}</Text>
        </View>
        <Text style={{ fontSize: 10, color: accentColor }}>{e.graduationYear}</Text>
      </View>
    ))}
  </Page>
);

export const CorporateSlate = ({ data }: { data: ResumeData }) => <ColorBlockTemplate data={data} mainColor="#0f172a" accentColor="#475569" bgColor="#f8fafc" />;
export const WarmAmber = ({ data }: { data: ResumeData }) => <ColorBlockTemplate data={data} mainColor="#78350f" accentColor="#b45309" bgColor="#fffbeb" />;
export const RoyalPurple = ({ data }: { data: ResumeData }) => <ColorBlockTemplate data={data} mainColor="#4c1d95" accentColor="#7c3aed" bgColor="#f5f3ff" />;
export const MinimalistCrimson = ({ data }: { data: ResumeData }) => <ColorBlockTemplate data={data} mainColor="#881337" accentColor="#e11d48" bgColor="#fff1f2" />;
export const VibrantAzure = ({ data }: { data: ResumeData }) => <ColorBlockTemplate data={data} mainColor="#0c4a6e" accentColor="#0ea5e9" bgColor="#f0f9ff" />;
export const CoralAccent = ({ data }: { data: ResumeData }) => <ColorBlockTemplate data={data} mainColor="#431407" accentColor="#f97316" bgColor="#fff7ed" />;
export const MonochromeMinimal = ({ data }: { data: ResumeData }) => <ColorBlockTemplate data={data} mainColor="#171717" accentColor="#525252" bgColor="#fafafa" />;
export const ForestGreenStructure = ({ data }: { data: ResumeData }) => <ColorBlockTemplate data={data} mainColor="#064e3b" accentColor="#059669" bgColor="#ecfdf5" />;

