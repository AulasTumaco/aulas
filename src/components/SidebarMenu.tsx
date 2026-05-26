type MenuItem = { name: string; label: string; icon: string };

const menuItems: MenuItem[] = [
  { name: "dashboard", label: "Dashboard", icon: "📊" },
  { name: "salones", label: "Salones", icon: "🏫" },
  { name: "materias", label: "Materias", icon: "📚" },
  { name: "docentes", label: "Docentes", icon: "👨‍🏫" },
  { name: "reservas", label: "Reservas", icon: "📅" },
  { name: "alertas", label: "Alertas", icon: "🚨" },
];

type Props = {
  current: string;
  onChange: (page: string) => void;
};

export default function SidebarMenu({ current, onChange }: Props) {
  return (
    <div className="space-y-2">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-gray-800">AulasTumaco</h1>
        <p className="text-xs text-gray-500">Udenar sede Tumaco</p>
      </div>
      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => onChange(item.name)}
            className={`text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors ${
              current === item.name
                ? "bg-blue-600 text-white font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}