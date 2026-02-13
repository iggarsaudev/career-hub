import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Link,
} from "@react-pdf/renderer";

// --- PALETA DE COLORES ---
const colors = {
  sidebarBg: "#1B3864",
  sidebarText: "#FFFFFF",
  primary: "#1B3864",
  text: "#374151",
  textLight: "#6B7280",
  border: "#E5E7EB",
};

// --- ESTILOS ---
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    fontSize: 9,
    lineHeight: 1.3,
    paddingTop: 30,
    paddingBottom: 30,
  },
  // === BARRA LATERAL ===
  leftColumn: {
    width: "28%",
    color: colors.sidebarText,
    paddingLeft: 15,
    paddingRight: 10,
    paddingTop: 0,
  },
  leftColumnBackground: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "28%",
    backgroundColor: colors.sidebarBg,
    zIndex: -1,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: "center",
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    backgroundColor: "#374151",
    objectFit: "cover",
    objectPosition: "50% 0%",
  },
  sidebarSection: {
    marginBottom: 15,
    paddingBottom: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },
  sidebarTitle: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sidebarLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#93C5FD",
    marginBottom: 1,
    textTransform: "uppercase",
  },
  sidebarItem: {
    fontSize: 8,
    marginBottom: 4,
    color: "#E5E7EB",
  },
  linkText: {
    color: "#FFFFFF",
    textDecoration: "none",
    fontSize: 7.5,
  },
  skillBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
    marginBottom: 3,
    fontSize: 7.5,
    color: "#FFFFFF",
    textAlign: "center",
  },

  // === COLUMNA PRINCIPAL ===
  rightColumn: {
    width: "72%",
    paddingRight: 25,
    paddingLeft: 20,
    paddingTop: 0,
  },

  // CABECERA
  headerContainer: {
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 10,
    marginTop: -10,
  },
  name: {
    fontSize: 22,
    fontWeight: "heavy",
    color: colors.primary,
    textTransform: "uppercase",
    marginBottom: 15,
  },
  jobTitle: {
    fontSize: 10,
    color: colors.textLight,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 2,
    marginTop: 5,
  },

  bioText: {
    fontSize: 9,
    color: "#374151",
    textAlign: "justify",
    marginBottom: 8,
    lineHeight: 1.4,
  },

  // ESTILOS NUEVOS PARA EXPERIENCIA (TIPO CAPTURA)
  entryContainer: {
    marginBottom: 10,
  },
  // Línea 1: Puesto, Empresa, Ciudad
  entryTitleLine: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#111827", // Negro casi puro para destacar
    marginBottom: 2,
  },
  // Línea 2: Fechas
  entryDateLine: {
    fontSize: 9,
    color: "#4B5563", // Gris para la fecha
    marginBottom: 4,
  },
  description: {
    fontSize: 8.5,
    color: "#4B5563",
    textAlign: "justify",
    lineHeight: 1.4,
  },
  // ESTILO PARA EL QR
  qrContainer: {
    alignItems: "center",
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: "rgba(255,255,255,0.2)",
  },
  qrImage: {
    width: 60,
    height: 60,
    backgroundColor: "white",
    padding: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  qrText: {
    fontSize: 7,
    color: "#93C5FD",
    textAlign: "center",
  },
});

// Helpers
const formatDate = (dateString) => {
  if (!dateString) return "Actualidad";
  try {
    const date = new Date(dateString);
    const formatted = date.toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric",
    });
    // Quitamos el "de" si prefieres el formato "Abril 2025" (opcional, aquí dejo el estándar)
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  } catch (e) {
    return dateString;
  }
};

const formatShortDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch (e) {
    return dateString;
  }
};

const CVDocument = ({
  profile,
  experience,
  education,
  skills,
  languages,
  qrCode,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* FONDO IZQUIERDA */}
      <View style={styles.leftColumnBackground} fixed />

      {/* CONTENIDO IZQUIERDA */}
      <View style={styles.leftColumn}>
        {profile?.avatar && (
          <Image src={profile.avatar} style={styles.profileImage} />
        )}

        {/* Contacto */}
        <View style={styles.sidebarSection}>
          <Text style={styles.sidebarTitle}>Contacto</Text>
          {profile?.location && (
            <View style={{ marginBottom: 4 }}>
              <Text style={styles.sidebarLabel}>Ubicación</Text>
              <Text style={styles.sidebarItem}>{profile.location}</Text>
            </View>
          )}
          {profile?.phone && (
            <View style={{ marginBottom: 4 }}>
              <Text style={styles.sidebarLabel}>Teléfono</Text>
              <Text style={styles.sidebarItem}>{profile.phone}</Text>
            </View>
          )}
          <View style={{ marginBottom: 4 }}>
            <Text style={styles.sidebarLabel}>Email</Text>
            <Text style={styles.sidebarItem}>{profile?.email}</Text>
          </View>
          {profile?.drivingLicense && (
            <View style={{ marginBottom: 4 }}>
              <Text style={styles.sidebarLabel}>Carnet</Text>
              <Text style={styles.sidebarItem}>{profile.drivingLicense}</Text>
            </View>
          )}
          {profile?.birthDate && (
            <View style={{ marginBottom: 4 }}>
              <Text style={styles.sidebarLabel}>Nacimiento</Text>
              <Text style={styles.sidebarItem}>
                {formatShortDate(profile.birthDate)}
              </Text>
            </View>
          )}
        </View>

        {/* Redes */}
        <View style={styles.sidebarSection}>
          <Text style={styles.sidebarTitle}>Redes</Text>
          <View style={{ marginBottom: 4 }}>
            <Text style={styles.sidebarLabel}>LinkedIn</Text>
            <Link
              src="https://linkedin.com/in/ignacio-garcia-sausor"
              style={{ textDecoration: "none" }}
            >
              <Text style={styles.linkText}>
                linkedin.com/in/ignacio-garcia-sausor
              </Text>
            </Link>
          </View>
          <View>
            <Text style={styles.sidebarLabel}>GitHub</Text>
            <Link
              src="https://github.com/iggarsaudev"
              style={{ textDecoration: "none" }}
            >
              <Text style={styles.linkText}>github.com/iggarsaudev</Text>
            </Link>
          </View>
          {/* QR  */}
          {qrCode && (
            <View style={styles.qrContainer}>
              <Image src={qrCode} style={styles.qrImage} />
              <Text style={styles.qrText}>Mi Portfolio Web</Text>
            </View>
          )}
        </View>

        {/* Skills */}
        <View style={styles.sidebarSection} wrap={false}>
          <Text style={styles.sidebarTitle}>Competencias</Text>
          <View>
            {skills.map((skill, index) => (
              <Text key={index} style={styles.skillBadge}>
                {skill.name}
              </Text>
            ))}
          </View>
        </View>

        {/* Idiomas */}
        <View
          style={{ ...styles.sidebarSection, borderBottomWidth: 0 }}
          wrap={false}
        >
          <Text style={styles.sidebarTitle}>Idiomas</Text>
          {languages.map((lang, index) => (
            <Text key={index} style={styles.sidebarItem}>
              • {lang.name} {lang.level ? `(${lang.level})` : ""}
            </Text>
          ))}
        </View>
      </View>

      {/* CONTENIDO DERECHA */}
      <View style={styles.rightColumn}>
        {/* CABECERA */}
        <View style={styles.headerContainer}>
          <Text style={styles.name}>{profile?.name}</Text>
          <Text style={styles.jobTitle}>{profile?.title}</Text>
        </View>

        {/* Perfil */}
        {(profile?.bio || profile?.summary) && (
          <View style={{ marginBottom: 15 }} wrap={false}>
            <Text style={styles.sectionTitle}>Perfil Profesional</Text>
            {profile?.summary && (
              <Text style={styles.bioText}>{profile.summary}</Text>
            )}
            {profile?.bio && <Text style={styles.bioText}>{profile.bio}</Text>}
          </View>
        )}

        {/* EXPERIENCIA (Nuevo Formato) */}
        <View style={{ marginBottom: 15 }}>
          <Text style={styles.sectionTitle}>Experiencia Laboral</Text>
          {experience.map((exp) => (
            <View key={exp.id} style={styles.entryContainer} wrap={false}>
              {/* Línea 1: Puesto, Empresa, Ciudad */}
              <Text style={styles.entryTitleLine}>
                {exp.position}, {exp.company}
                {exp.location ? `, ${exp.location}` : ""}
              </Text>

              {/* Línea 2: Fechas */}
              <Text style={styles.entryDateLine}>
                {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
              </Text>

              {/* Descripción */}
              {exp.description && (
                <Text style={styles.description}>{exp.description}</Text>
              )}
            </View>
          ))}
        </View>

        {/* FORMACIÓN */}
        <View>
          <Text style={styles.sectionTitle}>Formación</Text>
          {education.map((edu) => (
            <View key={edu.id} style={styles.entryContainer} wrap={false}>
              {/* Usamos el mismo estilo para consistencia */}
              <Text style={styles.entryTitleLine}>
                {edu.degree}, {edu.institution}
              </Text>
              <Text style={styles.entryDateLine}>{edu.year}</Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

export default CVDocument;
