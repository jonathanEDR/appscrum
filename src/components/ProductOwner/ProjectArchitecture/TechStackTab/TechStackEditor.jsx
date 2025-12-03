import React, { useState, useEffect } from 'react';
import { Code2, Server, Database as DatabaseIcon, Cloud, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

const TechStackEditor = ({ architecture, onSave, loading }) => {
  // Estado inicial del tech stack - alineado con modelo backend
  const [techStack, setTechStack] = useState({
    frontend: {
      framework: '',
      language: '',
      ui_library: '',
      state_management: '',
      build_tool: '',
      testing: '',
      additional: []  // Backend usa TechFieldSchema: [{name, version, notes}]
    },
    backend: {
      framework: '',
      language: '',
      orm: '',
      api_style: '',
      auth: '',
      testing: '',
      additional: []
    },
    database: {
      primary: '',           // Backend usa "primary" no "primary_db"
      primary_version: '',
      cache: '',
      search: '',            // Backend usa "search" no "search_engine"
      file_storage: '',
      additional: []
    },
    infrastructure: {
      hosting_frontend: '',  // Backend usa "hosting_frontend" no "frontend_hosting"
      hosting_backend: '',   // Backend usa "hosting_backend" no "backend_hosting"
      ci_cd: '',
      containers: '',
      monitoring: '',
      logging: '',
      cdn: '',
      additional: []
    }
  });

  const [activeSection, setActiveSection] = useState('frontend');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  // Cargar datos existentes
  useEffect(() => {
    if (architecture?.tech_stack) {
      setTechStack(prev => ({
        frontend: { ...prev.frontend, ...architecture.tech_stack.frontend },
        backend: { ...prev.backend, ...architecture.tech_stack.backend },
        database: { ...prev.database, ...architecture.tech_stack.database },
        infrastructure: { ...prev.infrastructure, ...architecture.tech_stack.infrastructure }
      }));
    }
  }, [architecture]);

  const handleChange = (section, field, value) => {
    setTechStack(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleAddTech = (section, tech) => {
    if (!tech.trim()) return;
    
    setTechStack(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        additional: [...(prev[section].additional || []), tech.trim()]
      }
    }));
  };

  const handleRemoveTech = (section, index) => {
    setTechStack(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        additional: prev[section].additional.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      await onSave(techStack);
      setSaveMessage({ type: 'success', text: 'Tech Stack guardado exitosamente' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Error al guardar Tech Stack' });
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    { id: 'frontend', label: 'Frontend', icon: Code2, color: 'blue' },
    { id: 'backend', label: 'Backend', icon: Server, color: 'green' },
    { id: 'database', label: 'Database', icon: DatabaseIcon, color: 'purple' },
    { id: 'infrastructure', label: 'Infrastructure', icon: Cloud, color: 'orange' }
  ];

  const getSectionColor = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Message */}
      {saveMessage && (
        <div className={`flex items-center gap-2 p-4 rounded-lg ${
          saveMessage.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {saveMessage.type === 'success' ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          {saveMessage.text}
        </div>
      )}

      {/* Section Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                activeSection === section.id
                  ? `bg-gradient-to-r ${getSectionColor(section.color)} text-white border-transparent shadow-lg scale-105`
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md text-gray-700'
              }`}
            >
              <Icon className="mx-auto mb-2" size={24} />
              <div className="font-semibold text-sm">{section.label}</div>
            </button>
          );
        })}
      </div>

      {/* Frontend Stack */}
      {activeSection === 'frontend' && (
        <FrontendStackForm 
          data={techStack.frontend}
          onChange={(field, value) => handleChange('frontend', field, value)}
          onAddTech={(tech) => handleAddTech('frontend', tech)}
          onRemoveTech={(index) => handleRemoveTech('frontend', index)}
        />
      )}

      {/* Backend Stack */}
      {activeSection === 'backend' && (
        <BackendStackForm 
          data={techStack.backend}
          onChange={(field, value) => handleChange('backend', field, value)}
          onAddTech={(tech) => handleAddTech('backend', tech)}
          onRemoveTech={(index) => handleRemoveTech('backend', index)}
        />
      )}

      {/* Database Stack */}
      {activeSection === 'database' && (
        <DatabaseStackForm 
          data={techStack.database}
          onChange={(field, value) => handleChange('database', field, value)}
          onAddTech={(tech) => handleAddTech('database', tech)}
          onRemoveTech={(index) => handleRemoveTech('database', index)}
        />
      )}

      {/* Infrastructure Stack */}
      {activeSection === 'infrastructure' && (
        <InfrastructureStackForm 
          data={techStack.infrastructure}
          onChange={(field, value) => handleChange('infrastructure', field, value)}
          onAddTech={(tech) => handleAddTech('infrastructure', tech)}
          onRemoveTech={(index) => handleRemoveTech('infrastructure', index)}
        />
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={isSaving || loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={18} />
          {isSaving ? 'Guardando...' : 'Guardar Tech Stack'}
        </button>
      </div>
    </div>
  );
};

// Frontend Stack Form Component
const FrontendStackForm = ({ data, onChange, onAddTech, onRemoveTech }) => {
  const [newTech, setNewTech] = useState('');

  const frameworks = ['React', 'Vue', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte', 'Gatsby', 'Astro', 'Otro'];
  const languages = ['JavaScript', 'TypeScript', 'Otro'];
  const uiLibraries = ['Tailwind CSS', 'Material UI', 'Chakra UI', 'Ant Design', 'Bootstrap', 'Shadcn/ui', 'Otro'];
  const stateManagement = ['Redux', 'Zustand', 'Context API', 'MobX', 'Recoil', 'Jotai', 'Otro'];
  const buildTools = ['Vite', 'Webpack', 'Parcel', 'esbuild', 'Rollup', 'Otro'];
  const testing = ['Jest', 'Vitest', 'Cypress', 'Playwright', 'Testing Library', 'Otro'];

  return (
    <div className="bg-white rounded-xl border-2 border-blue-200 p-6 space-y-4">
      <h3 className="text-xl font-bold text-blue-600 flex items-center gap-2">
        <Code2 size={24} />
        Frontend Stack
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Framework" value={data.framework} onChange={(v) => onChange('framework', v)} options={frameworks} />
        <FormField label="Lenguaje" value={data.language} onChange={(v) => onChange('language', v)} options={languages} />
        <FormField label="UI Library" value={data.ui_library} onChange={(v) => onChange('ui_library', v)} options={uiLibraries} />
        <FormField label="State Management" value={data.state_management} onChange={(v) => onChange('state_management', v)} options={stateManagement} />
        <FormField label="Build Tool" value={data.build_tool} onChange={(v) => onChange('build_tool', v)} options={buildTools} />
        <FormField label="Testing" value={data.testing} onChange={(v) => onChange('testing', v)} options={testing} />
      </div>

      <AdditionalTechs 
        techs={data.additional || []}
        newTech={newTech}
        setNewTech={setNewTech}
        onAdd={() => {
          onAddTech(newTech);
          setNewTech('');
        }}
        onRemove={onRemoveTech}
      />
    </div>
  );
};

// Backend Stack Form Component
const BackendStackForm = ({ data, onChange, onAddTech, onRemoveTech }) => {
  const [newTech, setNewTech] = useState('');

  const frameworks = ['Express', 'NestJS', 'FastAPI', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Ruby on Rails', 'Otro'];
  const languages = ['Node.js', 'Python', 'Java', 'Go', 'PHP', 'Ruby', 'C#', 'Otro'];
  const orms = ['Mongoose', 'Prisma', 'Sequelize', 'TypeORM', 'SQLAlchemy', 'Hibernate', 'Otro'];
  const apiStyles = ['REST', 'GraphQL', 'gRPC', 'SOAP', 'WebSocket', 'Otro'];
  const auths = ['JWT', 'OAuth 2.0', 'Clerk', 'Auth0', 'Passport.js', 'Firebase Auth', 'Otro'];
  const testing = ['Jest', 'Mocha', 'PyTest', 'JUnit', 'PHPUnit', 'Otro'];

  return (
    <div className="bg-white rounded-xl border-2 border-green-200 p-6 space-y-4">
      <h3 className="text-xl font-bold text-green-600 flex items-center gap-2">
        <Server size={24} />
        Backend Stack
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Framework" value={data.framework} onChange={(v) => onChange('framework', v)} options={frameworks} />
        <FormField label="Lenguaje" value={data.language} onChange={(v) => onChange('language', v)} options={languages} />
        <FormField label="ORM" value={data.orm} onChange={(v) => onChange('orm', v)} options={orms} />
        <FormField label="API Style" value={data.api_style} onChange={(v) => onChange('api_style', v)} options={apiStyles} />
        <FormField label="Autenticación" value={data.auth} onChange={(v) => onChange('auth', v)} options={auths} />
        <FormField label="Testing" value={data.testing} onChange={(v) => onChange('testing', v)} options={testing} />
      </div>

      <AdditionalTechs 
        techs={data.additional || []}
        newTech={newTech}
        setNewTech={setNewTech}
        onAdd={() => {
          onAddTech(newTech);
          setNewTech('');
        }}
        onRemove={onRemoveTech}
      />
    </div>
  );
};

// Database Stack Form Component
const DatabaseStackForm = ({ data, onChange, onAddTech, onRemoveTech }) => {
  const [newTech, setNewTech] = useState('');

  const primaryDbs = ['MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'SQL Server', 'Oracle', 'CouchDB', 'Otro'];
  const caches = ['Redis', 'Memcached', 'Otro'];
  const searchEngines = ['Elasticsearch', 'Algolia', 'MeiliSearch', 'Typesense', 'Otro'];
  const fileStorages = ['AWS S3', 'Cloudinary', 'Google Cloud Storage', 'Azure Blob', 'MinIO', 'Otro'];

  return (
    <div className="bg-white rounded-xl border-2 border-purple-200 p-6 space-y-4">
      <h3 className="text-xl font-bold text-purple-600 flex items-center gap-2">
        <DatabaseIcon size={24} />
        Database Stack
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Base de Datos Principal" value={data.primary} onChange={(v) => onChange('primary', v)} options={primaryDbs} />
        <FormField label="Cache" value={data.cache} onChange={(v) => onChange('cache', v)} options={caches} />
        <FormField label="Search Engine" value={data.search} onChange={(v) => onChange('search', v)} options={searchEngines} />
        <FormField label="File Storage" value={data.file_storage} onChange={(v) => onChange('file_storage', v)} options={fileStorages} />
      </div>

      <AdditionalTechs 
        techs={data.additional || []}
        newTech={newTech}
        setNewTech={setNewTech}
        onAdd={() => {
          onAddTech(newTech);
          setNewTech('');
        }}
        onRemove={onRemoveTech}
      />
    </div>
  );
};

// Infrastructure Stack Form Component
const InfrastructureStackForm = ({ data, onChange, onAddTech, onRemoveTech }) => {
  const [newTech, setNewTech] = useState('');

  const frontendHostings = ['Vercel', 'Netlify', 'AWS Amplify', 'GitHub Pages', 'Cloudflare Pages', 'Otro'];
  const backendHostings = ['Render', 'Railway', 'Heroku', 'AWS EC2', 'DigitalOcean', 'Google Cloud Run', 'Otro'];
  const ciCds = ['GitHub Actions', 'GitLab CI', 'Jenkins', 'CircleCI', 'Travis CI', 'Otro'];
  const containers = ['Docker', 'Kubernetes', 'Docker Compose', 'Otro'];
  const monitorings = ['Datadog', 'Sentry', 'New Relic', 'Prometheus', 'Grafana', 'Otro'];
  const cdns = ['Cloudflare', 'AWS CloudFront', 'Fastly', 'Otro'];

  return (
    <div className="bg-white rounded-xl border-2 border-orange-200 p-6 space-y-4">
      <h3 className="text-xl font-bold text-orange-600 flex items-center gap-2">
        <Cloud size={24} />
        Infrastructure Stack
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Frontend Hosting" value={data.hosting_frontend} onChange={(v) => onChange('hosting_frontend', v)} options={frontendHostings} />
        <FormField label="Backend Hosting" value={data.hosting_backend} onChange={(v) => onChange('hosting_backend', v)} options={backendHostings} />
        <FormField label="CI/CD" value={data.ci_cd} onChange={(v) => onChange('ci_cd', v)} options={ciCds} />
        <FormField label="Contenedores" value={data.containers} onChange={(v) => onChange('containers', v)} options={containers} />
        <FormField label="Monitoring" value={data.monitoring} onChange={(v) => onChange('monitoring', v)} options={monitorings} />
        <FormField label="CDN" value={data.cdn} onChange={(v) => onChange('cdn', v)} options={cdns} />
      </div>

      <AdditionalTechs 
        techs={data.additional || []}
        newTech={newTech}
        setNewTech={setNewTech}
        onAdd={() => {
          onAddTech(newTech);
          setNewTech('');
        }}
        onRemove={onRemoveTech}
      />
    </div>
  );
};

// Form Field Component
const FormField = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="">Seleccionar...</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

// Additional Technologies Component
const AdditionalTechs = ({ techs, newTech, setNewTech, onAdd, onRemove }) => (
  <div className="pt-4 border-t border-gray-200">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Tecnologías Adicionales
    </label>
    <div className="flex gap-2 mb-3">
      <input
        type="text"
        value={newTech}
        onChange={(e) => setNewTech(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onAdd()}
        placeholder="Agregar tecnología..."
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        onClick={onAdd}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Agregar
      </button>
    </div>
    <div className="flex flex-wrap gap-2">
      {techs.map((tech, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
        >
          {tech}
          <button
            onClick={() => onRemove(index)}
            className="text-gray-500 hover:text-red-600 ml-1"
          >
            ×
          </button>
        </span>
      ))}
    </div>
  </div>
);

export default TechStackEditor;
