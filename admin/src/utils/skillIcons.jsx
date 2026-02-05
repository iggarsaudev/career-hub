import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
  FaPython,
  FaGitAlt,
  FaGithub,
  FaDocker,
  FaAws,
  FaJava,
  FaPhp,
  FaDatabase,
  FaAndroid,
  FaWordpress,
  FaFigma,
} from "react-icons/fa";
import {
  SiTypescript,
  SiTailwindcss,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiNextdotjs,
  SiLaravel,
  SiSpring,
  SiVite,
  SiSass,
  SiJquery,
  SiExpress,
  SiAdobephotoshop,
  SiOracle,
} from "react-icons/si";

export const getSkillIcon = (skillName) => {
  const name = skillName.toLowerCase().trim();

  const icons = {
    // LENGUAJES
    javascript: <FaJs className="text-yellow-400" />,
    js: <FaJs className="text-yellow-400" />,
    typescript: <SiTypescript className="text-blue-600" />,
    java: <FaJava className="text-red-500" />,
    php: <FaPhp className="text-indigo-600" />,
    python: <FaPython className="text-blue-500" />,

    // FRONTEND
    html: <FaHtml5 className="text-orange-500" />,
    css: <FaCss3Alt className="text-blue-500" />,
    "react.js": <FaReact className="text-cyan-400" />,
    react: <FaReact className="text-cyan-400" />,
    vite: <SiVite className="text-purple-500" />,
    tailwindcss: <SiTailwindcss className="text-cyan-500" />,
    sass: <SiSass className="text-pink-500" />,
    jquery: <SiJquery className="text-blue-700" />,
    android: <FaAndroid className="text-green-500" />,
    "next.js": <SiNextdotjs className="text-black dark:text-white" />,

    // BACKEND
    "node.js": <FaNodeJs className="text-green-600" />,
    express: <SiExpress className="text-black dark:text-white" />, // Ahora usa el icono oficial
    laravel: <SiLaravel className="text-red-600" />,
    spring: <SiSpring className="text-green-500" />,

    // BASES DE DATOS
    sql: <FaDatabase className="text-gray-500" />,
    mysql: <SiMysql className="text-blue-700" />,
    postgresql: <SiPostgresql className="text-blue-400" />,
    mongodb: <SiMongodb className="text-green-500" />,
    "pl/sql": <SiOracle className="text-red-600" />,
    plsql: <SiOracle className="text-red-600" />,

    // DEVOPS
    docker: <FaDocker className="text-blue-500" />,
    aws: <FaAws className="text-orange-400" />,

    // HERRAMIENTAS
    git: <FaGitAlt className="text-orange-600" />,
    github: <FaGithub className="text-black dark:text-white" />,
    wordpress: <FaWordpress className="text-blue-600" />,
    "adobe photoshop": <SiAdobephotoshop className="text-blue-900" />,
    figma: <FaFigma className="text-pink-500" />,
  };

  return (
    icons[name] || (
      <span className="text-gray-400 font-bold text-xs">
        {skillName.slice(0, 2).toUpperCase()}
      </span>
    )
  );
};
