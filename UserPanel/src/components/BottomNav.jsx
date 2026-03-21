import { Receipt, Gift, CheckCircle, User } from "lucide-react";

export default function BottomNav({ active, setActive }) {
  const tabs = [
    { id: "bills", icon: <Receipt size={20} />, label: "Bills" },
    { id: "rewards", icon: <Gift size={20} />, label: "Rewards" },
    { id: "redemptions", icon: <CheckCircle size={20} />, label: "Redeem" },
    { id: "profile", icon: <User size={20} />, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50">
      <div className="flex max-w-lg mx-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors ${
              active === t.id ? "text-[#0f4089]" : "text-gray-400"
            }`}
          >
            <span className="mb-0.5">{t.icon}</span>
            <span className="text-[10px] font-semibold">{t.label}</span>
            {active === t.id && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] mt-0.5" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
