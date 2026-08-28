"use client"

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function CustomOrderForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [refSlug, setRefSlug] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiry_type: "custom_apparel",
    description: "",
    budget_range: "",
  });
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      setRefSlug(ref);
      setFormData(prev => ({
        ...prev,
        description: `I'm interested in customizing the item: ${ref}. My requirements are: `
      }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReferenceImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value);
    });
    if (referenceImage) {
      submitData.append("reference_image", referenceImage);
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/inquiries/`, {
        method: "POST",
        body: submitData,
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data);
        alert("Error submitting form. Please check fields.");
      } else {
        alert("Inquiry submitted successfully!");
        router.push("/");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 md:p-8 space-y-6">
      {refSlug && (
        <div className="border border-[var(--hiro-cyber-dim)] p-3 mb-6 font-[family-name:var(--font-mono)] text-sm text-[var(--hiro-cyber)]">
          Referring to product slug: {refSlug}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-xs font-[family-name:var(--font-mono)] uppercase mb-2 text-[var(--hiro-muted)]">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-[var(--hiro-surface)] border border-[var(--hiro-border-dim)] focus:border-[var(--hiro-cyber)] p-3 font-[family-name:var(--font-mono)] text-[var(--hiro-text)] outline-none transition-colors"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-[family-name:var(--font-mono)] uppercase mb-2 text-[var(--hiro-muted)]">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-[var(--hiro-surface)] border border-[var(--hiro-border-dim)] focus:border-[var(--hiro-cyber)] p-3 font-[family-name:var(--font-mono)] text-[var(--hiro-text)] outline-none transition-colors"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-xs font-[family-name:var(--font-mono)] uppercase mb-2 text-[var(--hiro-muted)]">
            Phone (Optional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-[var(--hiro-surface)] border border-[var(--hiro-border-dim)] focus:border-[var(--hiro-cyber)] p-3 font-[family-name:var(--font-mono)] text-[var(--hiro-text)] outline-none transition-colors"
          />
        </div>

        <div>
          <label htmlFor="inquiry_type" className="block text-xs font-[family-name:var(--font-mono)] uppercase mb-2 text-[var(--hiro-muted)]">
            Service Type
          </label>
          <select
            id="inquiry_type"
            name="inquiry_type"
            value={formData.inquiry_type}
            onChange={handleChange}
            className="w-full bg-[var(--hiro-surface)] border border-[var(--hiro-border-dim)] focus:border-[var(--hiro-cyber)] p-3 font-[family-name:var(--font-mono)] text-[var(--hiro-text)] outline-none transition-colors"
          >
            <option value="custom_apparel">Custom Apparel</option>
            <option value="graphic_design">Graphic Design</option>
            <option value="logo_design">Logo Design</option>
            <option value="card_design">Card/Letter Design</option>
            <option value="printing">Custom Printing</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-xs font-[family-name:var(--font-mono)] uppercase mb-2 text-[var(--hiro-muted)]">
          Project Details
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          required
          value={formData.description}
          onChange={handleChange}
          className="w-full bg-[var(--hiro-surface)] border border-[var(--hiro-border-dim)] focus:border-[var(--hiro-cyber)] p-3 font-[family-name:var(--font-mono)] text-[var(--hiro-text)] outline-none transition-colors resize-none"
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>}
      </div>

      <div>
        <label htmlFor="budget_range" className="block text-xs font-[family-name:var(--font-mono)] uppercase mb-2 text-[var(--hiro-muted)]">
          Budget Range (KES) - Optional
        </label>
        <input
          id="budget_range"
          name="budget_range"
          type="text"
          placeholder="e.g., 2000-5000"
          value={formData.budget_range}
          onChange={handleChange}
          className="w-full bg-[var(--hiro-surface)] border border-[var(--hiro-border-dim)] focus:border-[var(--hiro-cyber)] p-3 font-[family-name:var(--font-mono)] text-[var(--hiro-text)] outline-none transition-colors"
        />
      </div>

      <div>
        <label htmlFor="reference_image" className="block text-xs font-[family-name:var(--font-mono)] uppercase mb-2 text-[var(--hiro-muted)]">
          Reference Image (Max 5MB)
        </label>
        <input
          id="reference_image"
          name="reference_image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="w-full text-[var(--hiro-muted)] file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:bg-[var(--hiro-raised)] file:text-[var(--hiro-text)] file:font-[family-name:var(--font-mono)] hover:file:bg-[var(--hiro-border-dim)] file:cursor-pointer cursor-pointer"
        />
        {errors.reference_image && <p className="text-red-500 text-xs mt-1">{errors.reference_image[0]}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full md:w-auto flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-[var(--hiro-bg)] border-t-transparent animate-spin rounded-none"></div>
            TRANSMITTING...
          </>
        ) : (
          "SUBMIT INQUIRY"
        )}
      </button>
    </form>
  );
}
