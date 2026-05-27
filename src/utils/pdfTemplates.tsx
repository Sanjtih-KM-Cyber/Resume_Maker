import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Link } from '@react-pdf/renderer';
import { ResumeData, TemplateId } from '../types';

const styles = StyleSheet.create({
  page: { flexDirection: 'column', display: 'flex', backgroundColor: '#FFFFFF', paddingBottom: 40, height: 'auto', flexGrow: 1, justifyContent: 'flex-start', alignItems: 'stretch' },
  link: { textDecoration: 'none', color: '#000000' },
  sectionWrap: { marginBottom: 15 }
});

const RenderSkills = ({ data, headerStyle, color = '#334155' }: { data: ResumeData, headerStyle?: any, color?: string }) => (
  <View style={headerStyle?.marginBottom ? { marginBottom: headerStyle.marginBottom } : { marginBottom: 15 }} wrap={false}>
    <Text style={{ ...headerStyle, color, marginBottom: headerStyle?.paddingBottom ? headerStyle.marginBottom : 10 }} minPresenceAhead={100}>SKILLS</Text>
    {data.skills?.coreExpertise && data.skills.coreExpertise.length > 0 && (
      <View style={{ marginBottom: 4 }}>
        <Text style={{ fontSize: 9, fontFamily: headerStyle?.fontFamily === 'Times-Bold' ? 'Times-Bold' : (headerStyle?.fontFamily === 'Courier-Bold' ? 'Courier-Bold' : 'Helvetica-Bold') }}>Core Expertise: <Text style={{ fontFamily: headerStyle?.fontFamily === 'Times-Bold' ? 'Times-Roman' : (headerStyle?.fontFamily === 'Courier-Bold' ? 'Courier' : 'Helvetica') }}>{data.skills.coreExpertise.join(', ')}</Text></Text>
      </View>
    )}
    {data.skills?.technicalTools && data.skills.technicalTools.length > 0 && (
      <View style={{ marginBottom: 4 }}>
        <Text style={{ fontSize: 9, fontFamily: headerStyle?.fontFamily === 'Times-Bold' ? 'Times-Bold' : (headerStyle?.fontFamily === 'Courier-Bold' ? 'Courier-Bold' : 'Helvetica-Bold') }}>Technical Tools: <Text style={{ fontFamily: headerStyle?.fontFamily === 'Times-Bold' ? 'Times-Roman' : (headerStyle?.fontFamily === 'Courier-Bold' ? 'Courier' : 'Helvetica') }}>{data.skills.technicalTools.join(', ')}</Text></Text>
      </View>
    )}
    {data.skills?.methodologies && data.skills.methodologies.length > 0 && (
      <View style={{ marginBottom: 4 }}>
        <Text style={{ fontSize: 9, fontFamily: headerStyle?.fontFamily === 'Times-Bold' ? 'Times-Bold' : (headerStyle?.fontFamily === 'Courier-Bold' ? 'Courier-Bold' : 'Helvetica-Bold') }}>Methodologies: <Text style={{ fontFamily: headerStyle?.fontFamily === 'Times-Bold' ? 'Times-Roman' : (headerStyle?.fontFamily === 'Courier-Bold' ? 'Courier' : 'Helvetica') }}>{data.skills.methodologies.join(', ')}</Text></Text>
      </View>
    )}
  </View>
);

const OptionalSections = ({ data, color = '#334155', headerStyle }: { data: ResumeData, color?: string, headerStyle?: any }) => (
  <>
    {data.preferences?.showCertifications !== false && data.certifications && data.certifications.length > 0 && (
      <View style={styles.sectionWrap} wrap={false}>
        <Text style={{ ...headerStyle, color }} minPresenceAhead={100}>CERTIFICATIONS</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
          {(data.certifications || []).map((c, i) => (
            <Text key={i} style={{ fontSize: 9 }}>• {c}</Text>
          ))}
        </View>
      </View>
    )}
    
    {data.preferences?.showProjects !== false && data.projects && data.projects.length > 0 && (
      <View style={styles.sectionWrap} wrap={false}>
        <Text style={{ ...headerStyle, color }} minPresenceAhead={100}>PROJECTS</Text>
        {(data.projects || []).map((p, i) => (
        <View key={i} style={{ marginBottom: 5 }}>
            <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold' }} wrap={false}>{p.title}</Text>
            <Text style={{ fontSize: 9, color: '#475569', lineHeight: 1.4 }}>{p.description}</Text>
          </View>
        ))}
      </View>
    )}

    {data.preferences?.showLanguages !== false && data.languages && data.languages.length > 0 && (
      <View style={styles.sectionWrap} wrap={false}>
        <Text style={{ ...headerStyle, color }} minPresenceAhead={100}>LANGUAGES</Text>
        <Text style={{ fontSize: 9 }}>{data.languages.join(' | ')}</Text>
      </View>
    )}
  </>
);

// 1. Modern
const ModernTemplate = ({ data }: { data: ResumeData }) => (
  <Page wrap={true} size="A4" style={{ ...styles.page, padding: 40, borderTop: 8, borderColor: '#475569' }}>
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 24, fontFamily: 'Helvetica-Bold', color: '#334155' }}>{data.contactInfo.fullName}</Text>
      <Text style={{ fontSize: 14, color: '#475569', marginTop: 3 }}>{data.contactInfo.targetTitle}</Text>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 5, flexWrap: 'wrap' }}>
        <Text style={{ fontSize: 9, color: '#64748b' }}>{data.contactInfo.email}</Text>
        <Text style={{ fontSize: 9, color: '#64748b' }}>| {data.contactInfo.phone}</Text>
        <Text style={{ fontSize: 9, color: '#64748b' }}>| {data.contactInfo.location}</Text>
        {data.linkedinUrl && <Link src={data.linkedinUrl} style={{ fontSize: 9, color: '#64748b', textDecoration: 'none' }}>| {data.linkedinUrl}</Link>}
        {data.portfolioUrl && <Link src={data.portfolioUrl} style={{ fontSize: 9, color: '#64748b', textDecoration: 'none' }}>| {data.portfolioUrl}</Link>}
      </View>
    </View>
    
    <View style={{ marginBottom: 15 }} wrap={false}>
      <Text style={{ fontSize: 10, lineHeight: 1.4, color: '#334155' }}>{data.professionalSummary}</Text>
    </View>

    <View style={{ marginBottom: 15, borderLeft: 2, paddingLeft: 10, borderColor: '#94a3b8' }}>
      <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#334155', marginBottom: 10 }} wrap={false} minPresenceAhead={100}>EXPERIENCE</Text>
      {(data.workExperience || []).map((w, i) => (
        <View key={i} style={{ marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} wrap={false}>
            <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold' }}>{w.roleTitle}</Text>
            <Text style={{ fontSize: 9, color: '#64748b' }}>{w.dates}</Text>
          </View>
          <Text style={{ fontSize: 10, color: '#64748b', marginBottom: 5 }}>{w.company} - {w.location}</Text>
          {(w.bullets || []).map((h, j) => (
            <Text key={j} style={{ fontSize: 9, marginBottom: 3, paddingLeft: 10, lineHeight: 1.4 }}>• {h}</Text>
          ))}
        </View>
      ))}
    </View>

    <View style={{ marginBottom: 15, borderLeft: 2, paddingLeft: 10, borderColor: '#94a3b8' }} wrap={false}>
      <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#334155', marginBottom: 10 }} minPresenceAhead={100}>EDUCATION</Text>
      {(data.education || []).map((e, i) => (
        <View key={i} style={{ marginBottom: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
          <View wrap={false}>
            <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold' }}>{e.institution}</Text>
            <Text style={{ fontSize: 9 }}>{e.degree}</Text>
          </View>
          <Text style={{ fontSize: 9, color: '#64748b' }}>{e.graduationYear}</Text>
        </View>
      ))}
    </View>

    <View style={{ borderLeft: 2, paddingLeft: 10, borderColor: '#94a3b8' }} wrap={false}>
      <RenderSkills data={data} headerStyle={{ fontSize: 14, fontFamily: 'Helvetica-Bold', marginBottom: 10 }} color="#334155" />
    </View>

    <View style={{ borderLeft: 2, paddingLeft: 10, borderColor: '#94a3b8' }}>
      <OptionalSections data={data} headerStyle={{ fontSize: 14, fontFamily: 'Helvetica-Bold', marginBottom: 10 }} />
    </View>
  </Page>
);

// 2. Minimalist
const MinimalistTemplate = ({ data }: { data: ResumeData }) => (
  <Page wrap={true} size="A4" style={{ ...styles.page, padding: 50, fontFamily: 'Helvetica' }}>
    <View style={{ alignItems: 'center', marginBottom: 20 }}>
      <Text style={{ fontSize: 24, letterSpacing: 2 }}>{data.contactInfo.fullName.toUpperCase()}</Text>
      <Text style={{ fontSize: 12, marginTop: 4, color: '#444' }}>{data.contactInfo.targetTitle}</Text>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 5, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Text style={{ fontSize: 8 }}>{data.contactInfo.email}</Text>
        <Text style={{ fontSize: 8 }}>• {data.contactInfo.phone}</Text>
        <Text style={{ fontSize: 8 }}>• {data.contactInfo.location}</Text>
        {data.linkedinUrl && <Text style={{ fontSize: 8 }}>• {data.linkedinUrl}</Text>}
        {data.portfolioUrl && <Text style={{ fontSize: 8 }}>• {data.portfolioUrl}</Text>}
      </View>
    </View>

    <View style={{ marginBottom: 15 }}>
      <Text style={{ fontSize: 9, lineHeight: 1.4, textAlign: 'justify' }}>{data.professionalSummary}</Text>
    </View>

    <View style={{ borderBottom: 0.5, marginBottom: 10 }} />
    <Text style={{ fontSize: 10, letterSpacing: 1.5, marginBottom: 10 }} minPresenceAhead={100}>EXPERIENCE</Text>
    {(data.workExperience || []).map((w, i) => (
      <View key={i} style={{ marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} wrap={false}>
          <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold' }}>{w.roleTitle} at {w.company} | {w.location}</Text>
          <Text style={{ fontSize: 8 }}>{w.dates}</Text>
        </View>
        <View style={{ marginTop: 4 }}>
          {(w.bullets || []).map((h, j) => (
            <View key={j} style={{ flexDirection: 'row', marginBottom: 2 }}>
              <Text style={{ fontSize: 8, marginRight: 5 }}>-</Text>
              <Text style={{ fontSize: 8, flex: 1, lineHeight: 1.4 }}>{h}</Text>
            </View>
          ))}
        </View>
      </View>
    ))}

    <View style={{ borderBottom: 0.5, marginBottom: 10, marginTop: 10 }} />
    <Text style={{ fontSize: 10, letterSpacing: 1.5, marginBottom: 10 }} minPresenceAhead={100}>EDUCATION</Text>
    {(data.education || []).map((e, i) => (
        <View key={i} style={{ marginBottom: 5 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} wrap={false}>
          <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold' }}>{e.institution}</Text>
          <Text style={{ fontSize: 8 }}>{e.graduationYear}</Text>
        </View>
        <Text style={{ fontSize: 8 }}>{e.degree}</Text>
      </View>
    ))}

    <View style={{ borderBottom: 0.5, marginBottom: 10, marginTop: 10 }} />
    <RenderSkills data={data} headerStyle={{ fontSize: 10, letterSpacing: 1.5, marginBottom: 10 }} color="#000" />

    <View style={{ marginTop: 10 }}>
      {data.preferences?.showCertifications !== false || data.preferences?.showProjects !== false || data.preferences?.showLanguages !== false ? <View style={{ borderBottom: 0.5, marginBottom: 10 }} /> : null}
      <OptionalSections data={data} headerStyle={{ fontSize: 10, letterSpacing: 1.5, marginBottom: 10 }} color="#000" />
    </View>
  </Page>
);

// 3. Tech
const TechTemplate = ({ data }: { data: ResumeData }) => (
  <Page wrap={true} size="A4" style={{ ...styles.page, padding: 40 }}>
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 26, fontFamily: 'Helvetica-Bold', color: '#0f172a' }}>{data.contactInfo.fullName}</Text>
      <Text style={{ fontSize: 14, fontFamily: 'Courier', color: '#334155', marginTop: 4 }}>{data.contactInfo.targetTitle}</Text>
      <Text style={{ fontSize: 9, fontFamily: 'Courier', color: '#334155', marginTop: 5 }}>
        {data.contactInfo.email} // {data.contactInfo.phone} // {data.contactInfo.location}
      </Text>
      {data.linkedinUrl && <Text style={{ fontSize: 9, fontFamily: 'Courier', color: '#334155' }}>// {data.linkedinUrl}</Text>}
      {data.portfolioUrl && <Text style={{ fontSize: 9, fontFamily: 'Courier', color: '#334155' }}>// {data.portfolioUrl}</Text>}
    </View>

    <View style={{ backgroundColor: '#f1f5f9', padding: 10, marginBottom: 20 }}>
      <Text style={{ fontSize: 9, fontFamily: 'Courier', lineHeight: 1.4, color: '#334155' }}>{data.professionalSummary}</Text>
    </View>

    <Text style={{ fontSize: 12, fontFamily: 'Courier-Bold', color: '#0f172a', marginBottom: 10, borderBottom: 1, paddingBottom: 3 }} minPresenceAhead={100}>[ EXPERIENCE ]</Text>
    {(data.workExperience || []).map((w, i) => (
      <View key={i} style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} wrap={false}>
          <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#0f172a' }}>{w.roleTitle}</Text>
          <Text style={{ fontSize: 9, fontFamily: 'Courier' }}>{w.dates}</Text>
        </View>
        <Text style={{ fontSize: 10, color: '#475569', marginBottom: 5 }}>@ {w.company} - {w.location}</Text>
        {(w.bullets || []).map((h, j) => (
          <View key={j} style={{ flexDirection: 'row', marginBottom: 3 }}>
            <Text style={{ fontSize: 9, fontFamily: 'Courier', color: '#64748b', marginRight: 5 }}>{">"}</Text>
            <Text style={{ fontSize: 9, flex: 1, lineHeight: 1.4, color: '#334155' }}>{h}</Text>
          </View>
        ))}
      </View>
    ))}

    <RenderSkills data={data} headerStyle={{ fontSize: 12, fontFamily: 'Courier-Bold', marginBottom: 10, borderBottom: 1, paddingBottom: 3 }} color="#0f172a" />

    <View style={{ marginTop: 15 }}>
      <OptionalSections data={data} headerStyle={{ fontSize: 12, fontFamily: 'Courier-Bold', marginBottom: 10, borderBottom: 1, paddingBottom: 3 }} color="#0f172a" />
    </View>
  </Page>
);

// 4. Executive
const ExecutiveTemplate = ({ data }: { data: ResumeData }) => (
  <Page wrap={true} size="A4" style={{ ...styles.page, padding: 55, fontFamily: 'Times-Roman' }}>
    <View style={{ alignItems: 'center', marginBottom: 25 }}>
      <Text style={{ fontSize: 26, fontFamily: 'Times-Bold' }}>{data.contactInfo.fullName}</Text>
      <Text style={{ fontSize: 14, fontFamily: 'Times-Italic', marginTop: 4 }}>{data.contactInfo.targetTitle}</Text>
      <View style={{ flexDirection: 'row', gap: 15, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Text style={{ fontSize: 10 }}>{data.contactInfo.location}</Text>
        <Text style={{ fontSize: 10 }}>|</Text>
        <Text style={{ fontSize: 10 }}>{data.contactInfo.phone}</Text>
        <Text style={{ fontSize: 10 }}>|</Text>
        <Text style={{ fontSize: 10 }}>{data.contactInfo.email}</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 15, marginTop: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
        {data.linkedinUrl && <Text style={{ fontSize: 10 }}>{data.linkedinUrl}</Text>}
        {data.linkedinUrl && data.portfolioUrl && <Text style={{ fontSize: 10 }}>|</Text>}
        {data.portfolioUrl && <Text style={{ fontSize: 10 }}>{data.portfolioUrl}</Text>}
      </View>
    </View>

    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 11, lineHeight: 1.4, textAlign: 'justify' }}>{data.professionalSummary}</Text>
    </View>

    <View style={{ alignItems: 'center', marginBottom: 15 }}>
      <Text style={{ fontSize: 12, fontFamily: 'Times-Bold', borderBottom: 1, paddingBottom: 2 }} minPresenceAhead={100}>PROFESSIONAL EXPERIENCE</Text>
    </View>
    {(data.workExperience || []).map((w, i) => (
      <View key={i} style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }} wrap={false}>
          <Text style={{ fontSize: 11, fontFamily: 'Times-Bold' }}>{w.company} – {w.location}</Text>
          <Text style={{ fontSize: 10, fontFamily: 'Times-Italic' }}>{w.dates}</Text>
        </View>
        <Text style={{ fontSize: 10, fontFamily: 'Times-Italic', marginBottom: 6 }}>{w.roleTitle}</Text>
        {(w.bullets || []).map((h, j) => (
          <View key={j} style={{ flexDirection: 'row', marginBottom: 3 }}>
            <Text style={{ fontSize: 10, marginRight: 8, marginTop: -1 }}>•</Text>
            <Text style={{ fontSize: 10, flex: 1, lineHeight: 1.4, textAlign: 'justify' }}>{h}</Text>
          </View>
        ))}
      </View>
    ))}

    <View style={{ alignItems: 'center', marginBottom: 15, marginTop: 10 }}>
      <Text style={{ fontSize: 12, fontFamily: 'Times-Bold', borderBottom: 1, paddingBottom: 2 }} minPresenceAhead={100}>EDUCATION</Text>
    </View>
    {(data.education || []).map((e, i) => (
        <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
        <View wrap={false}>
          <Text style={{ fontSize: 11, fontFamily: 'Times-Bold' }}>{e.institution}</Text>
          <Text style={{ fontSize: 10 }}>{e.degree}</Text>
        </View>
        <Text style={{ fontSize: 10 }}>{e.graduationYear}</Text>
      </View>
    ))}
    <View style={{ marginTop: 15 }}>
      <OptionalSections data={data} headerStyle={{ fontSize: 12, fontFamily: 'Times-Bold', borderBottom: 1, paddingBottom: 2, textAlign: 'center' }} color="#000" />
    </View>
  </Page>
);

// 5. Creative
const CreativeTemplate = ({ data }: { data: ResumeData }) => (
  <Page wrap={true} size="A4" style={{ ...styles.page, padding: 0, paddingBottom: 40 }}>
    <View style={{ backgroundColor: '#065f46', padding: 40, color: 'white' }}>
      <Text style={{ fontSize: 32, fontFamily: 'Helvetica-Bold' }}>{data.contactInfo.fullName}</Text>
      <Text style={{ fontSize: 16, marginTop: 5 }}>{data.contactInfo.targetTitle}</Text>
      <Text style={{ fontSize: 12, marginTop: 10, lineHeight: 1.4 }}>{data.professionalSummary}</Text>
      <View style={{ flexDirection: 'row', gap: 15, marginTop: 15, flexWrap: 'wrap' }}>
        <Text style={{ fontSize: 9 }}>Email: {data.contactInfo.email}</Text>
        <Text style={{ fontSize: 9 }}>Phone: {data.contactInfo.phone}</Text>
        <Text style={{ fontSize: 9 }}>Location: {data.contactInfo.location}</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 15, marginTop: 5, flexWrap: 'wrap' }}>
        {data.linkedinUrl && <Text style={{ fontSize: 9 }}>LinkedIn: {data.linkedinUrl}</Text>}
        {data.portfolioUrl && <Text style={{ fontSize: 9 }}>Portfolio: {data.portfolioUrl}</Text>}
      </View>
    </View>
    
    <View style={{ padding: 40 }}>
      <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#065f46', marginBottom: 15 }} minPresenceAhead={100}>EXPERIENCE</Text>
      {(data.workExperience || []).map((w, i) => (
        <View key={i} style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold' }} wrap={false}>{w.roleTitle}</Text>
          <Text style={{ fontSize: 10, color: '#065f46', marginBottom: 5 }}>{w.company} | {w.location} | {w.dates}</Text>
          {(w.bullets || []).map((h, j) => (
            <Text key={j} style={{ fontSize: 10, marginBottom: 3, color: '#333', lineHeight: 1.4 }}>• {h}</Text>
          ))}
        </View>
      ))}

      <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#065f46', marginBottom: 15, marginTop: 10 }} minPresenceAhead={100}>SKILLS</Text>
      <RenderSkills data={data} headerStyle={{ display: 'none' }} color="#065f46" />

      <View style={{ marginTop: 20 }}>
        <OptionalSections data={data} headerStyle={{ fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#065f46', marginBottom: 15 }} />
      </View>
    </View>
  </Page>
);

// 6. Compact
const CompactTemplate = ({ data }: { data: ResumeData }) => (
  <Page wrap={true} size="A4" style={{ ...styles.page, padding: 18 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: 1, paddingBottom: 5, marginBottom: 8 }}>
      <View>
        <Text style={{ fontSize: 18, fontFamily: 'Helvetica-Bold' }}>{data.contactInfo.fullName}</Text>
        <Text style={{ fontSize: 10, color: '#555' }}>{data.contactInfo.targetTitle}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontSize: 8 }}>{data.contactInfo.email} | {data.contactInfo.phone} | {data.contactInfo.location}</Text>
        {data.linkedinUrl && <Text style={{ fontSize: 8 }}>{data.linkedinUrl}</Text>}
        {data.portfolioUrl && <Text style={{ fontSize: 8 }}>{data.portfolioUrl}</Text>}
      </View>
    </View>

    <Text style={{ fontSize: 9, marginBottom: 8, lineHeight: 1.4 }}>{data.professionalSummary}</Text>

    <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', backgroundColor: '#f0f0f0', padding: 2, marginBottom: 5 }} minPresenceAhead={100}>EXPERIENCE</Text>
    {(data.workExperience || []).map((w, i) => (
      <View key={i} style={{ marginBottom: 6 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} wrap={false}>
          <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold' }}>{w.company} - {w.roleTitle}</Text>
          <Text style={{ fontSize: 8 }}>{w.dates} | {w.location}</Text>
        </View>
        {(w.bullets || []).map((h, j) => (
          <Text key={j} style={{ fontSize: 8, marginLeft: 10, lineHeight: 1.4 }}>• {h}</Text>
        ))}
      </View>
    ))}

    <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', backgroundColor: '#f0f0f0', padding: 2, marginBottom: 5 }} minPresenceAhead={100}>EDUCATION</Text>
    {(data.education || []).map((e, i) => (
        <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
        <Text style={{ fontSize: 9 }} wrap={false}><Text style={{ fontFamily: 'Helvetica-Bold' }}>{e.institution}</Text>, {e.degree}</Text>
        <Text style={{ fontSize: 8 }}>{e.graduationYear}</Text>
      </View>
    ))}

    <RenderSkills data={data} headerStyle={{ fontSize: 10, fontFamily: 'Helvetica-Bold', backgroundColor: '#f0f0f0', padding: 2, marginBottom: 5, marginTop: 5 }} color="#000" />

    <OptionalSections data={data} headerStyle={{ fontSize: 10, fontFamily: 'Helvetica-Bold', backgroundColor: '#f0f0f0', padding: 2, marginBottom: 5, marginTop: 5 }} color="#000" />
  </Page>
);

// 7. Bold
const BoldTemplate = ({ data }: { data: ResumeData }) => (
  <Page wrap={true} size="A4" style={{ flexDirection: 'row', backgroundColor: '#ffffff', paddingBottom: 40, height: 'auto', flexGrow: 1, justifyContent: 'flex-start', alignItems: 'stretch' }}>
    {/* Sidebar */}
    <View style={{ width: '30%', backgroundColor: '#1e293b', padding: 20, color: 'white' }}>
      <Text style={{ fontSize: 20, fontFamily: 'Helvetica-Bold', marginBottom: 5 }}>{data.contactInfo.fullName}</Text>
      <Text style={{ fontSize: 11, marginBottom: 20, color: '#94a3b8' }}>{data.contactInfo.targetTitle}</Text>
      
      <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 5, color: '#94a3b8' }}>CONTACT</Text>
      <Text style={{ fontSize: 8, marginBottom: 3 }}>{data.contactInfo.email}</Text>
      <Text style={{ fontSize: 8, marginBottom: 3 }}>{data.contactInfo.phone}</Text>
      <Text style={{ fontSize: 8, marginBottom: 3 }}>{data.contactInfo.location}</Text>
      {data.linkedinUrl && <Text style={{ fontSize: 8, marginBottom: 3 }}>{data.linkedinUrl}</Text>}
      {data.portfolioUrl && <Text style={{ fontSize: 8, marginBottom: 20 }}>{data.portfolioUrl}</Text>}

      <RenderSkills data={data} headerStyle={{ fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 10 }} color="#94a3b8" />

      {data.preferences?.showLanguages !== false && data.languages && data.languages.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 10, color: '#94a3b8' }} minPresenceAhead={100}>LANGUAGES</Text>
          {(data.languages || []).map((l, i) => <Text key={i} style={{ fontSize: 8, marginBottom: 2 }}>• {l}</Text>)}
        </View>
      )}

      {data.preferences?.showCertifications !== false && data.certifications && data.certifications.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 10, color: '#94a3b8' }} minPresenceAhead={100}>CERTIFICATIONS</Text>
          {(data.certifications || []).map((c, i) => <Text key={i} style={{ fontSize: 8, marginBottom: 2, lineHeight: 1.4 }}>• {c}</Text>)}
        </View>
      )}
    </View>
    
    {/* Main Content */}
    <View style={{ width: '70%', padding: 30 }}>
      <Text style={{ fontSize: 10, lineHeight: 1.4, marginBottom: 20, color: '#334155' }}>{data.professionalSummary}</Text>
      
      <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#1e293b', borderBottom: 2, borderColor: '#cbd5e1', paddingBottom: 5, marginBottom: 10 }} minPresenceAhead={100}>EXPERIENCE</Text>
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

      <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#1e293b', borderBottom: 2, borderColor: '#cbd5e1', paddingBottom: 5, marginBottom: 10, marginTop: 10 }} minPresenceAhead={100}>EDUCATION</Text>
      {(data.education || []).map((e, i) => (
        <View key={i} style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#1e293b' }} wrap={false}>{e.institution}</Text>
          <Text style={{ fontSize: 10, color: '#475569' }}>{e.degree} ({e.graduationYear})</Text>
        </View>
      ))}

      {data.preferences?.showProjects !== false && data.projects && data.projects.length > 0 && (
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#1e293b', borderBottom: 2, borderColor: '#cbd5e1', paddingBottom: 5, marginBottom: 10 }} minPresenceAhead={100}>PROJECTS</Text>
          {(data.projects || []).map((p, i) => (
        <View key={i} style={{ marginBottom: 5 }}>
              <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#1e293b' }} wrap={false}>{p.title}</Text>
              <Text style={{ fontSize: 9, color: '#475569', lineHeight: 1.4 }}>{p.description}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  </Page>
);

// 8. Elegant
const ElegantTemplate = ({ data }: { data: ResumeData }) => (
  <Page wrap={true} size="A4" style={{ ...styles.page, padding: 50, backgroundColor: '#fafaf9' }}>
    <View style={{ alignItems: 'center', marginBottom: 30 }}>
      <Text style={{ fontSize: 22, fontFamily: 'Times-Roman', color: '#44403c', letterSpacing: 1 }}>{data.contactInfo.fullName.toUpperCase()}</Text>
      <Text style={{ fontSize: 12, fontFamily: 'Times-Italic', color: '#57534e', marginTop: 4 }}>{data.contactInfo.targetTitle}</Text>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Text style={{ fontSize: 9, color: '#78716c' }}>{data.contactInfo.email}</Text>
        <Text style={{ fontSize: 9, color: '#78716c' }}>|</Text>
        <Text style={{ fontSize: 9, color: '#78716c' }}>{data.contactInfo.phone}</Text>
        <Text style={{ fontSize: 9, color: '#78716c' }}>|</Text>
        <Text style={{ fontSize: 9, color: '#78716c' }}>{data.contactInfo.location}</Text>
      </View>
      {(data.linkedinUrl || data.portfolioUrl) && (
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          {data.linkedinUrl && <Text style={{ fontSize: 9, color: '#78716c' }}>{data.linkedinUrl}</Text>}
          {data.portfolioUrl && <Text style={{ fontSize: 9, color: '#78716c' }}>{data.portfolioUrl}</Text>}
        </View>
      )}
    </View>

    <View style={{ marginBottom: 25, paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 10, fontFamily: 'Times-Italic', lineHeight: 1.4, textAlign: 'center', color: '#57534e' }}>"{data.professionalSummary}"</Text>
    </View>

    <Text style={{ fontSize: 11, fontFamily: 'Times-Bold', color: '#44403c', letterSpacing: 2, marginBottom: 15, textAlign: 'center' }} minPresenceAhead={100}>EXPERIENCE</Text>
    {(data.workExperience || []).map((w, i) => (
      <View key={i} style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 5, marginBottom: 5, flexWrap: 'wrap' }} wrap={false}>
          <Text style={{ fontSize: 10, fontFamily: 'Times-Bold', color: '#44403c' }}>{w.roleTitle}</Text>
          <Text style={{ fontSize: 10, color: '#78716c' }}>at {w.company} | {w.location}</Text>
          <Text style={{ fontSize: 10, color: '#a8a29e' }}>({w.dates})</Text>
        </View>
        {(w.bullets || []).map((h, j) => (
          <Text key={j} style={{ fontSize: 9, fontFamily: 'Times-Roman', color: '#57534e', marginBottom: 4, textAlign: 'center', paddingHorizontal: 30, lineHeight: 1.4 }}>{h}</Text>
        ))}
      </View>
    ))}
    
    <OptionalSections data={data} headerStyle={{ fontSize: 11, fontFamily: 'Times-Bold', color: '#44403c', letterSpacing: 2, marginBottom: 15, textAlign: 'center', marginTop: 15 }} />
  </Page>
);

// 9. Creative Pic
const CreativePicTemplate = ({ data }: { data: ResumeData }) => (
  <Page wrap={true} size="A4" style={{ flexDirection: 'row', backgroundColor: '#ffffff', paddingBottom: 40, height: 'auto', flexGrow: 1, justifyContent: 'flex-start', alignItems: 'stretch' }}>
    <View style={{ width: '35%', backgroundColor: '#f4f4f5', padding: 20, alignItems: 'center' }}>
      {data.preferences?.showPhoto !== false && data.profileImageBase64 ? (
        <Image src={data.profileImageBase64} style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 20, objectFit: 'cover' }} />
      ) : (
        <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#d4d4d8', marginBottom: 20 }} />
      )}
      <Text style={{ fontSize: 18, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 5 }}>{data.contactInfo.fullName}</Text>
      <Text style={{ fontSize: 10, color: '#52525b', marginBottom: 20, textAlign: 'center' }}>{data.contactInfo.targetTitle}</Text>
      <Text style={{ fontSize: 9, color: '#52525b', marginBottom: 5 }}>{data.contactInfo.email}</Text>
      <Text style={{ fontSize: 9, color: '#52525b', marginBottom: 5 }}>{data.contactInfo.phone}</Text>
      <Text style={{ fontSize: 9, color: '#52525b', marginBottom: 5 }}>{data.contactInfo.location}</Text>
      {data.linkedinUrl && <Text style={{ fontSize: 9, color: '#52525b', marginBottom: 5, textAlign: 'center' }}>{data.linkedinUrl}</Text>}
      {data.portfolioUrl && <Text style={{ fontSize: 9, color: '#52525b', marginBottom: 20, textAlign: 'center' }}>{data.portfolioUrl}</Text>}

      <RenderSkills data={data} headerStyle={{ fontSize: 12, fontFamily: 'Helvetica-Bold', marginBottom: 10, marginTop: 10, color: '#000' }} color="#000" />
      
      {data.preferences?.showLanguages !== false && data.languages && data.languages.length > 0 && (
        <View style={{ alignSelf: 'flex-start', marginTop: 20 }}>
          <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', marginBottom: 10 }} minPresenceAhead={100}>LANGUAGES</Text>
          {(data.languages || []).map((kw, i) => (
            <Text key={i} style={{ fontSize: 9, marginBottom: 4, color: '#3f3f46' }}>• {kw}</Text>
          ))}
        </View>
      )}

      {data.preferences?.showCertifications !== false && data.certifications && data.certifications.length > 0 && (
        <View style={{ alignSelf: 'flex-start', marginTop: 20 }}>
          <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', marginBottom: 10 }} minPresenceAhead={100}>CERTIFICATIONS</Text>
          {(data.certifications || []).map((kw, i) => (
            <Text key={i} style={{ fontSize: 9, marginBottom: 4, color: '#3f3f46', lineHeight: 1.4 }}>• {kw}</Text>
          ))}
        </View>
      )}
    </View>

    <View style={{ width: '65%', padding: 30 }}>
      <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#18181b', marginBottom: 10 }}>PROFILE</Text>
      <Text style={{ fontSize: 10, lineHeight: 1.4, color: '#52525b', marginBottom: 20 }}>{data.professionalSummary}</Text>

      <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#18181b', marginBottom: 10 }} minPresenceAhead={100}>EXPERIENCE</Text>
      {(data.workExperience || []).map((w, i) => (
        <View key={i} style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold' }} wrap={false}>{w.roleTitle}</Text>
          <Text style={{ fontSize: 9, color: '#71717a', marginBottom: 5 }}>{w.company} - {w.location} | {w.dates}</Text>
          {(w.bullets || []).map((h, j) => (
            <Text key={j} style={{ fontSize: 9, marginBottom: 3, color: '#3f3f46', lineHeight: 1.4 }}>- {h}</Text>
          ))}
        </View>
      ))}
      
      <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#18181b', marginBottom: 10, marginTop: 10 }} minPresenceAhead={100}>EDUCATION</Text>
      {(data.education || []).map((e, i) => (
        <View key={i} style={{ marginBottom: 5 }}>
          <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold' }} wrap={false}>{e.institution}</Text>
          <Text style={{ fontSize: 9, color: '#52525b' }}>{e.degree} ({e.graduationYear})</Text>
        </View>
      ))}

      {data.preferences?.showProjects !== false && data.projects && data.projects.length > 0 && (
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#18181b', marginBottom: 10 }} minPresenceAhead={100}>PROJECTS</Text>
          {(data.projects || []).map((p, i) => (
        <View key={i} style={{ marginBottom: 5 }}>
              <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold' }} wrap={false}>{p.title}</Text>
              <Text style={{ fontSize: 9, color: '#52525b', lineHeight: 1.4 }}>{p.description}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  </Page>
);

// 10. Corporate Pic
const CorporatePicTemplate = ({ data }: { data: ResumeData }) => (
  <Page wrap={true} size="A4" style={{ ...styles.page, padding: 40 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottom: 2, paddingBottom: 15 }}>
      <View style={{ width: '70%' }}>
        <Text style={{ fontSize: 24, fontFamily: 'Times-Bold' }}>{data.contactInfo.fullName}</Text>
        <Text style={{ fontSize: 12, fontFamily: 'Times-Roman', marginTop: 5, color: '#444' }}>{data.contactInfo.targetTitle}</Text>
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 10 }}>{data.contactInfo.email} | {data.contactInfo.phone}</Text>
          <Text style={{ fontSize: 10 }}>{data.contactInfo.location}</Text>
          {data.linkedinUrl && <Text style={{ fontSize: 10 }}>{data.linkedinUrl}</Text>}
          {data.portfolioUrl && <Text style={{ fontSize: 10 }}>{data.portfolioUrl}</Text>}
        </View>
      </View>
      <View style={{ width: '25%', alignItems: 'flex-end' }}>
        {data.preferences?.showPhoto !== false && data.profileImageBase64 ? (
          <Image src={data.profileImageBase64} style={{ width: 80, height: 80, border: 1, borderColor: '#ccc', objectFit: 'cover' }} />
        ) : (
          <View style={{ width: 80, height: 80, border: 1, borderColor: '#ccc', backgroundColor: '#f9f9f9' }} />
        )}
      </View>
    </View>

    <View style={{ marginBottom: 15 }}>
      <Text style={{ fontSize: 11, fontFamily: 'Times-Bold', marginBottom: 5 }}>SUMMARY</Text>
      <Text style={{ fontSize: 10, fontFamily: 'Times-Roman', lineHeight: 1.4 }}>{data.professionalSummary}</Text>
    </View>

    <View style={{ marginBottom: 15 }}>
      <Text style={{ fontSize: 11, fontFamily: 'Times-Bold', marginBottom: 10, backgroundColor: '#f0f0f0', padding: 3 }} minPresenceAhead={100}>PROFESSIONAL EXPERIENCE</Text>
      {(data.workExperience || []).map((w, i) => (
        <View key={i} style={{ marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} wrap={false}>
            <Text style={{ fontSize: 10, fontFamily: 'Times-Bold' }}>{w.company} - {w.location}</Text>
            <Text style={{ fontSize: 9 }}>{w.dates}</Text>
          </View>
          <Text style={{ fontSize: 10, fontFamily: 'Times-Italic', marginBottom: 4 }}>{w.roleTitle}</Text>
          {(w.bullets || []).map((h, j) => (
            <Text key={j} style={{ fontSize: 9, marginBottom: 2, lineHeight: 1.4 }}>• {h}</Text>
          ))}
        </View>
      ))}
    </View>

    <OptionalSections data={data} headerStyle={{ fontSize: 11, fontFamily: 'Times-Bold', marginBottom: 10, backgroundColor: '#f0f0f0', padding: 3 }} color="#000" />
    
  </Page>
);

// 11. Academic CV
const AcademicCvTemplate = ({ data }: { data: ResumeData }) => (
  <Page wrap={true} size="A4" style={{ ...styles.page, padding: 50, fontFamily: 'Times-Roman' }}>
    <View style={{ alignItems: 'center', marginBottom: 20, borderBottom: 1, paddingBottom: 15 }}>
      <Text style={{ fontSize: 28, fontFamily: 'Times-Bold' }}>{data.contactInfo.fullName}</Text>
      <Text style={{ fontSize: 13, fontFamily: 'Times-Italic', marginTop: 4 }}>{data.contactInfo.targetTitle}</Text>
      <View style={{ flexDirection: 'row', gap: 15, marginTop: 8, justifyContent: 'center' }}>
        <Text style={{ fontSize: 10 }}>{data.contactInfo.email}</Text>
        <Text style={{ fontSize: 10 }}>{data.contactInfo.phone}</Text>
      </View>
      <Text style={{ fontSize: 10, marginTop: 4 }}>{data.contactInfo.location}</Text>
      {(data.linkedinUrl || data.portfolioUrl) && (
        <View style={{ flexDirection: 'row', gap: 15, marginTop: 4, justifyContent: 'center' }}>
          {data.linkedinUrl && <Text style={{ fontSize: 10 }}>{data.linkedinUrl}</Text>}
          {data.portfolioUrl && <Text style={{ fontSize: 10 }}>{data.portfolioUrl}</Text>}
        </View>
      )}
    </View>

    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 11, fontFamily: 'Times-Bold', marginBottom: 8, letterSpacing: 1 }}>PROFESSIONAL PROFILE</Text>
      <Text style={{ fontSize: 10, lineHeight: 1.4, textAlign: 'justify' }}>{data.professionalSummary}</Text>
    </View>

    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 11, fontFamily: 'Times-Bold', marginBottom: 10, letterSpacing: 1 }} minPresenceAhead={100}>EDUCATION</Text>
      {(data.education || []).map((e, i) => (
        <View key={i} style={{ marginBottom: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} wrap={false}>
            <Text style={{ fontSize: 11, fontFamily: 'Times-Bold' }}>{e.institution}</Text>
            <Text style={{ fontSize: 10 }}>{e.graduationYear}</Text>
          </View>
          <Text style={{ fontSize: 10, fontFamily: 'Times-Italic' }}>{e.degree}</Text>
        </View>
      ))}
    </View>

    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 11, fontFamily: 'Times-Bold', marginBottom: 10, letterSpacing: 1 }}>ACADEMIC & PROFESSIONAL EXPERIENCE</Text>
      {(data.workExperience || []).map((w, i) => (
        <View key={i} style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} wrap={false}>
            <Text style={{ fontSize: 10, fontFamily: 'Times-Bold' }}>{w.roleTitle}</Text>
            <Text style={{ fontSize: 10 }}>{w.dates}</Text>
          </View>
          <Text style={{ fontSize: 10, fontFamily: 'Times-Italic', marginBottom: 4 }}>{w.company}, {w.location}</Text>
          {(w.bullets || []).map((h, j) => (
            <View key={j} style={{ flexDirection: 'row', marginBottom: 2, paddingLeft: 10 }}>
              <Text style={{ fontSize: 10, marginRight: 6 }}>•</Text>
              <Text style={{ fontSize: 10, flex: 1, lineHeight: 1.4, textAlign: 'justify' }}>{h}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>

    <RenderSkills data={data} headerStyle={{ fontSize: 11, fontFamily: 'Times-Bold', marginBottom: 10, letterSpacing: 1 }} color="#000" />
    <OptionalSections data={data} headerStyle={{ fontSize: 11, fontFamily: 'Times-Bold', marginBottom: 10, marginTop: 10, letterSpacing: 1 }} color="#000" />
  </Page>
);

// 12. Clean Grid
const CleanGridTemplate = ({ data }: { data: ResumeData }) => (
  <Page wrap={true} size="A4" style={{ ...styles.page, padding: 30, backgroundColor: '#fdfdfc' }}>
    <View style={{ flexDirection: 'row', borderBottom: 2, paddingBottom: 20, marginBottom: 20, borderColor: '#e2e8f0' }}>
      <View style={{ width: '60%' }}>
        <Text style={{ fontSize: 24, fontFamily: 'Helvetica-Bold', color: '#0f172a' }}>{data.contactInfo.fullName}</Text>
        <Text style={{ fontSize: 12, color: '#3b82f6', marginTop: 4, fontFamily: 'Helvetica-Bold' }}>{data.contactInfo.targetTitle}</Text>
      </View>
      <View style={{ width: '40%', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
        <Text style={{ fontSize: 9, color: '#475569', marginBottom: 2 }}>{data.contactInfo.phone} | {data.contactInfo.email}</Text>
        <Text style={{ fontSize: 9, color: '#475569', marginBottom: 2 }}>{data.contactInfo.location}</Text>
        {data.linkedinUrl && <Text style={{ fontSize: 9, color: '#475569', marginBottom: 2 }}>{data.linkedinUrl}</Text>}
      </View>
    </View>

    <View style={{ flexDirection: 'row' }}>
      <View style={{ width: '35%', paddingRight: 20, borderRight: 1, borderColor: '#e2e8f0' }}>
        <RenderSkills data={data} headerStyle={{ fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 10, color: '#0f172a' }} color="#0f172a" />
        
        <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', marginTop: 20, marginBottom: 10, color: '#0f172a' }} minPresenceAhead={100}>EDUCATION</Text>
        {(data.education || []).map((e, i) => (
        <View key={i} style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#1e293b' }} wrap={false}>{e.degree}</Text>
            <Text style={{ fontSize: 9, color: '#475569', marginTop: 2 }}>{e.institution}</Text>
            <Text style={{ fontSize: 8, color: '#64748b', marginTop: 2 }}>{e.graduationYear}</Text>
          </View>
        ))}

        {data.preferences?.showLanguages !== false && data.languages && data.languages.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 10, color: '#0f172a' }} minPresenceAhead={100}>LANGUAGES</Text>
            {(data.languages || []).map((l, i) => <Text key={i} style={{ fontSize: 9, color: '#475569', marginBottom: 3 }}>• {l}</Text>)}
          </View>
        )}
      </View>
      
      <View style={{ width: '65%', paddingLeft: 20 }}>
        <Text style={{ fontSize: 10, lineHeight: 1.4, color: '#334155', marginBottom: 20 }}>{data.professionalSummary}</Text>
        
        <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#0f172a', marginBottom: 15 }} minPresenceAhead={100}>WORK EXPERIENCE</Text>
        {(data.workExperience || []).map((w, i) => (
          <View key={i} style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#1e293b' }} wrap={false}>{w.roleTitle}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
              <Text style={{ fontSize: 9, color: '#3b82f6', fontFamily: 'Helvetica-Bold' }}>{w.company}</Text>
              <Text style={{ fontSize: 9, color: '#64748b' }}>{w.dates} | {w.location}</Text>
            </View>
            <View style={{ borderLeft: 2, borderColor: '#e2e8f0', paddingLeft: 10, marginTop: 5 }}>
              {(w.bullets || []).map((h, j) => (
                <Text key={j} style={{ fontSize: 9, color: '#475569', marginBottom: 4, lineHeight: 1.4 }}>{h}</Text>
              ))}
            </View>
          </View>
        ))}

        {data.preferences?.showProjects !== false && data.projects && data.projects.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#0f172a', marginBottom: 10 }} minPresenceAhead={100}>PROJECTS</Text>
            {(data.projects || []).map((p, i) => (
        <View key={i} style={{ marginBottom: 5 }}>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#1e293b' }} wrap={false}>{p.title}</Text>
                <Text style={{ fontSize: 9, color: '#475569', lineHeight: 1.4 }}>{p.description}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  </Page>
);

// 13. Startup Minimal
const StartupMinimalTemplate = ({ data }: { data: ResumeData }) => (
  <Page wrap={true} size="A4" style={{ ...styles.page, padding: 50 }}>
    <View style={{ marginBottom: 30 }}>
      <Text style={{ fontSize: 26, fontFamily: 'Helvetica', fontWeight: 'light', letterSpacing: 1, color: '#111' }}>{data.contactInfo.fullName.toLowerCase()}</Text>
      <Text style={{ fontSize: 11, color: '#666', marginTop: 5, letterSpacing: 0.5 }}>{data.contactInfo.targetTitle.toLowerCase()}</Text>
      <View style={{ flexDirection: 'row', gap: 15, marginTop: 10 }}>
        <Text style={{ fontSize: 8, color: '#888' }}>{data.contactInfo.email}</Text>
        <Text style={{ fontSize: 8, color: '#888' }}>{data.contactInfo.phone}</Text>
        {data.linkedinUrl && <Text style={{ fontSize: 8, color: '#888' }}>{data.linkedinUrl}</Text>}
      </View>
    </View>

    <View style={{ marginBottom: 30 }}>
      <Text style={{ fontSize: 10, lineHeight: 1.4, color: '#333' }}>{data.professionalSummary}</Text>
    </View>

    {(data.workExperience || []).map((w, i) => (
      <View key={i} style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, alignItems: 'flex-end' }} wrap={false}>
          <View>
            <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#111' }}>{w.roleTitle}</Text>
            <Text style={{ fontSize: 9, color: '#666', marginTop: 2 }}>{w.company}</Text>
          </View>
          <Text style={{ fontSize: 8, color: '#999' }}>{w.dates}</Text>
        </View>
        {(w.bullets || []).map((h, j) => (
          <Text key={j} style={{ fontSize: 9, color: '#444', marginBottom: 4, lineHeight: 1.4 }}>— {h}</Text>
        ))}
      </View>
    ))}

    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
      <View style={{ width: '48%' }}>
        <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#111', marginBottom: 10, letterSpacing: 1 }}>EXPERTISE</Text>
        <RenderSkills data={data} headerStyle={{ display: 'none' }} color="#111" />
      </View>
      <View style={{ width: '48%' }}>
        <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#111', marginBottom: 10, letterSpacing: 1 }}>BACKGROUND</Text>
        {(data.education || []).map((e, i) => (
        <View key={i} style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 9, color: '#333' }} wrap={false}>{e.degree}</Text>
            <Text style={{ fontSize: 8, color: '#777', marginTop: 2 }}>{e.institution}, {e.graduationYear}</Text>
          </View>
        ))}
      </View>
    </View>
  </Page>
);

// 14. Classic Border
const ClassicBorderTemplate = ({ data }: { data: ResumeData }) => (
  <Page wrap={true} size="A4" style={{ ...styles.page, padding: 30 }}>
    <View style={{ border: 2, borderColor: '#2c3e50', padding: 20, flex: 1 }}>
      <View style={{ alignItems: 'center', borderBottom: 1, borderColor: '#bdc3c7', paddingBottom: 15, marginBottom: 15 }}>
        <Text style={{ fontSize: 24, fontFamily: 'Times-Bold', color: '#2c3e50' }}>{data.contactInfo.fullName.toUpperCase()}</Text>
        <Text style={{ fontSize: 12, fontFamily: 'Times-Italic', color: '#34495e', marginTop: 5 }}>{data.contactInfo.targetTitle}</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
          <Text style={{ fontSize: 9, color: '#7f8c8d' }}>{data.contactInfo.location} | {data.contactInfo.phone} | {data.contactInfo.email}</Text>
        </View>
      </View>

      <Text style={{ fontSize: 10, lineHeight: 1.4, color: '#2c3e50', marginBottom: 15, textAlign: 'justify' }}>{data.professionalSummary}</Text>

      <Text style={{ fontSize: 12, fontFamily: 'Times-Bold', color: '#2c3e50', backgroundColor: '#ecf0f1', padding: 4, marginBottom: 10 }} minPresenceAhead={100}>PROFESSIONAL EXPERIENCE</Text>
      {(data.workExperience || []).map((w, i) => (
        <View key={i} style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} wrap={false}>
            <Text style={{ fontSize: 11, fontFamily: 'Times-Bold', color: '#2c3e50' }}>{w.roleTitle}</Text>
            <Text style={{ fontSize: 9, fontFamily: 'Times-Italic', color: '#34495e' }}>{w.dates}</Text>
          </View>
          <Text style={{ fontSize: 10, color: '#34495e', marginBottom: 4 }}>{w.company}, {w.location}</Text>
          {(w.bullets || []).map((h, j) => (
            <View key={j} style={{ flexDirection: 'row', marginBottom: 2, paddingLeft: 10 }}>
              <Text style={{ fontSize: 9, marginRight: 5, color: '#2c3e50' }}>•</Text>
              <Text style={{ fontSize: 9, flex: 1, lineHeight: 1.4, color: '#2c3e50' }}>{h}</Text>
            </View>
          ))}
        </View>
      ))}

      <Text style={{ fontSize: 12, fontFamily: 'Times-Bold', color: '#2c3e50', backgroundColor: '#ecf0f1', padding: 4, marginBottom: 10 }} minPresenceAhead={100}>EDUCATION</Text>
      {(data.education || []).map((e, i) => (
        <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
          <View wrap={false}>
            <Text style={{ fontSize: 10, fontFamily: 'Times-Bold', color: '#2c3e50' }}>{e.institution}</Text>
            <Text style={{ fontSize: 9, color: '#34495e' }}>{e.degree}</Text>
          </View>
          <Text style={{ fontSize: 9, color: '#7f8c8d' }}>{e.graduationYear}</Text>
        </View>
      ))}

      <RenderSkills data={data} headerStyle={{ fontSize: 12, fontFamily: 'Times-Bold', color: '#2c3e50', backgroundColor: '#ecf0f1', padding: 4, marginBottom: 10, marginTop: 10 }} color="#2c3e50" />
    </View>
  </Page>
);

// 15. Neo Brutalism

// ATS Max
const AtsMaxTemplate = ({ data }: { data: ResumeData }) => (
  <Page wrap={true} size="A4" style={{ ...styles.page, padding: 36, fontFamily: 'Helvetica' }}>
    <View style={{ marginBottom: 15 }}>
      <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold' }}>{data.contactInfo.fullName}</Text>
      <Text style={{ fontSize: 10 }}>{data.contactInfo.targetTitle}</Text>
      <Text style={{ fontSize: 9, marginTop: 4 }}>{data.contactInfo.email} | {data.contactInfo.phone} | {data.contactInfo.location}</Text>
    </View>

    <View style={{ marginBottom: 15 }}>
      <Text style={{ fontSize: 10, lineHeight: 1.4 }}>{data.professionalSummary}</Text>
    </View>

    <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', borderBottom: 1, paddingBottom: 2, marginBottom: 8 }} minPresenceAhead={100}>PROFESSIONAL EXPERIENCE</Text>
    {(data.workExperience || []).map((w, i) => (
      <View key={i} style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold' }}>{w.roleTitle}</Text>
        <Text style={{ fontSize: 10 }}>{w.company} - {w.location} | {w.dates}</Text>
        <View style={{ marginTop: 4 }}>
          {(w.bullets || []).map((h, j) => (
            <Text key={j} style={{ fontSize: 10, marginBottom: 3, lineHeight: 1.4 }}>• {h}</Text>
          ))}
        </View>
      </View>
    ))}

    <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', borderBottom: 1, paddingBottom: 2, marginBottom: 8 }} minPresenceAhead={100}>EDUCATION</Text>
    {(data.education || []).map((e, i) => (
      <View key={i} style={{ marginBottom: 6 }}>
        <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold' }}>{e.degree}</Text>
        <Text style={{ fontSize: 10 }}>{e.institution} | {e.graduationYear}</Text>
      </View>
    ))}

    <RenderSkills data={data} headerStyle={{ fontSize: 12, fontFamily: 'Helvetica-Bold', borderBottom: 1, paddingBottom: 2, marginBottom: 8, marginTop: 10 }} color="#000" />
  </Page>
);

// 15. Neo Brutalism
const NeoBrutalismTemplate = ({ data }: { data: ResumeData }) => (
  <Page wrap={true} size="A4" style={{ ...styles.page, padding: 30, backgroundColor: '#fdfbc8' }}>
    <View style={{ border: 3, borderColor: '#000', padding: 20, backgroundColor: '#fff',  marginBottom: 20 }}>
      <Text style={{ fontSize: 32, fontFamily: 'Helvetica-Bold', color: '#000', textTransform: 'uppercase' }}>{data.contactInfo.fullName}</Text>
      <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#ff3b3b', marginTop: 5, backgroundColor: '#000', padding: 4, alignSelf: 'flex-start' }}>{data.contactInfo.targetTitle}</Text>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 15, flexWrap: 'wrap' }}>
        <Text style={{ fontSize: 10, fontFamily: 'Courier-Bold', backgroundColor: '#e0e0e0', padding: 3, border: 1 }}>{data.contactInfo.email}</Text>
        <Text style={{ fontSize: 10, fontFamily: 'Courier-Bold', backgroundColor: '#e0e0e0', padding: 3, border: 1 }}>{data.contactInfo.phone}</Text>
        <Text style={{ fontSize: 10, fontFamily: 'Courier-Bold', backgroundColor: '#e0e0e0', padding: 3, border: 1 }}>{data.contactInfo.location}</Text>
      </View>
    </View>

    <View style={{ border: 3, borderColor: '#000', padding: 15, backgroundColor: '#e0f2fe', marginBottom: 20 }}>
      <Text style={{ fontSize: 11, fontFamily: 'Courier-Bold', lineHeight: 1.4, color: '#000' }}>{data.professionalSummary}</Text>
    </View>

    <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#000', marginBottom: 15, borderBottom: 4, borderColor: '#000', paddingBottom: 5 }}>WORK HISTORY</Text>
    {(data.workExperience || []).map((w, i) => (
      <View key={i} style={{ marginBottom: 12, borderLeft: 3, borderColor: '#000', paddingLeft: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }} wrap={false}>
          <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', backgroundColor: '#dcfce7', padding: 3, border: 1 }}>{w.roleTitle}</Text>
          <Text style={{ fontSize: 10, fontFamily: 'Courier-Bold', backgroundColor: '#000', color: '#fff', padding: 3 }}>{w.dates}</Text>
        </View>
        <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 5 }}>{w.company} // {w.location}</Text>
        {(w.bullets || []).map((h, j) => (
          <Text key={j} style={{ fontSize: 10, fontFamily: 'Courier', marginBottom: 4, lineHeight: 1.4 }}>{'>'} {h}</Text>
        ))}
      </View>
    ))}

    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
      <View style={{ width: '48%', border: 3, borderColor: '#000', padding: 15, backgroundColor: '#fff' }}>
        <RenderSkills data={data} headerStyle={{ fontSize: 14, fontFamily: 'Helvetica-Bold', borderBottom: 2, borderColor: '#000', marginBottom: 10, paddingBottom: 4 }} color="#000" />
      </View>
      <View style={{ width: '48%', border: 3, borderColor: '#000', padding: 15, backgroundColor: '#fef08a' }}>
        <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', borderBottom: 2, borderColor: '#000', paddingBottom: 4, marginBottom: 10 }} minPresenceAhead={100}>EDUCATION</Text>
        {(data.education || []).map((e, i) => (
        <View key={i} style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold' }} wrap={false}>{e.institution}</Text>
            <Text style={{ fontSize: 10, fontFamily: 'Courier-Bold' }}>{e.degree}</Text>
            <Text style={{ fontSize: 10, fontFamily: 'Courier-Bold' }}>{e.graduationYear}</Text>
          </View>
        ))}
      </View>
    </View>
  </Page>
);

import { 
  ModernNavySidebar, 
  CreativeTealSplit, 
  ExecutiveGoldAccent, 
  EmeraldTechGrid, 
  CorporateSlate, 
  WarmAmber, 
  RoyalPurple, 
  MinimalistCrimson, 
  VibrantAzure, 
  CoralAccent, 
  MonochromeMinimal, 
  ForestGreenStructure 
} from './TemplateModernDeck';

export const ResumeDocument = ({ data, templateId }: { data: ResumeData; templateId: TemplateId }) => {
  return (
    <Document>
      {templateId === 'reverse-chronological' && <ModernTemplate data={data} />}
      {templateId === 'minimalist' && <MinimalistTemplate data={data} />}
      {templateId === 'executive' && <ExecutiveTemplate data={data} />}
      {templateId === 'ats-max' && <AtsMaxTemplate data={data} />}
      {templateId === 'one-page-condensed' && <CompactTemplate data={data} />}
      
      {templateId === 'combination-hybrid' && <NeoBrutalismTemplate data={data} />}
      {templateId === 'technical' && <TechTemplate data={data} />}
      {templateId === 'project-focused' && <MinimalistTemplate data={data} />}
      {templateId === 'startup-minimal' && <StartupMinimalTemplate data={data} />}
      {templateId === 'targeted-precision' && <ClassicBorderTemplate data={data} />}
      
      {templateId === 'functional-skills' && <BoldTemplate data={data} />}
      {templateId === 'career-changer' && <ElegantTemplate data={data} />}
      {templateId === 'entry-level' && <StartupMinimalTemplate data={data} />}
      {templateId === 'internship-academic' && <ModernNavySidebar data={data} />}
      
      {templateId === 'modern-two-column' && <EmeraldTechGrid data={data} />}
      {templateId === 'creative-pic' && <CreativePicTemplate data={data} />}
      {templateId === 'corporate-pic' && <CorporatePicTemplate data={data} />}
      {templateId === 'hybrid-sidebar' && <ForestGreenStructure data={data} />}
      
      {templateId === 'academic-cv' && <AcademicCvTemplate data={data} />}
      {templateId === 'portfolio-link-grid' && <VibrantAzure data={data} />}

      {/* 12 New Modern Deck Themes */}
      {templateId === 'modern-navy-sidebar' && <ModernNavySidebar data={data} />}
      {templateId === 'creative-teal-split' && <CreativeTealSplit data={data} />}
      {templateId === 'executive-gold-accent' && <ExecutiveGoldAccent data={data} />}
      {templateId === 'emerald-tech-grid' && <EmeraldTechGrid data={data} />}
      {templateId === 'corporate-slate' && <CorporateSlate data={data} />}
      {templateId === 'warm-amber' && <WarmAmber data={data} />}
      {templateId === 'royal-purple' && <RoyalPurple data={data} />}
      {templateId === 'minimalist-crimson' && <MinimalistCrimson data={data} />}
      {templateId === 'vibrant-azure' && <VibrantAzure data={data} />}
      {templateId === 'coral-accent' && <CoralAccent data={data} />}
      {templateId === 'monochrome-minimal' && <MonochromeMinimal data={data} />}
      {templateId === 'forest-green-structure' && <ForestGreenStructure data={data} />}
    </Document>
  );
};
