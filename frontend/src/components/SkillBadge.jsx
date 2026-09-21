export default function SkillBadge({ children, accent = false }) { return <span className={`skill-badge ${accent ? 'skill-accent' : ''}`}>{children}</span>; }
