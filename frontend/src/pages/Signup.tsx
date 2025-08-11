import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const passwordStrength = () => {
    if (form.password.length >= 8) return { label: "Strong", color: "bg-green-500", width: "w-full" };
    if (form.password.length >= 4) return { label: "Medium", color: "bg-yellow-500", width: "w-2/3" };
    if (form.password.length > 0) return { label: "Weak", color: "bg-red-500", width: "w-1/3" };
    return { label: "", color: "", width: "w-0" };
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
  };

  const strength = passwordStrength();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl w-[400px] shadow-xl">
        <div className="flex justify-between mb-6">
          <h1 className="text-lg font-semibold text-white tracking-wide">
            Rental Management
          </h1>
          <button className="px-4 py-1 rounded-full text-sm border border-white/30 hover:bg-white/20 transition">
            Home
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="admin" className="text-black">Admin</option>
              <option value="customer" className="text-black">Customer</option>
              <option value="end-user" className="text-black">End User</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Your Email</label>
            <input
              type="email"
              name="email"
              placeholder="admin"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Your Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. John Doe"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Your Phone</label>
            <input
              type="tel"
              name="phone"
              placeholder="e.g. 9099898090"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="*****"
                value={form.password}
                onChange={handleChange}
                className="w-full p-2 rounded bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-400 outline-none pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-2 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {strength.label && (
              <div className="mt-2">
                <div className="h-1 rounded-full bg-white/20 overflow-hidden">
                  <div className={`${strength.color} ${strength.width} h-1 transition-all`}></div>
                </div>
                <p className="text-xs text-gray-300 mt-1">{strength.label}</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-md hover:scale-105 transition-transform"
          >
            SIGN IN
          </button>

          <p className="text-sm mt-4 text-gray-400">
            already have account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-400 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;