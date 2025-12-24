"use client";

import { useState } from "react";
import axios from "@/lib/axios";
import Alert from "@/components/ui/alert/Alert";

export default function ContactClient() {
    const [alertState, setAlertState] = useState<{
        variant: "success" | "error";
        title: string;
        message: string;
    } | null>(null);
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        category: "Technical Support",
        subject: "",
        message: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setAlertState(null);

        try {
            await axios.post("/api/public/inquiries", formData);
            setAlertState({
                variant: 'success',
                title: 'Message Sent Successfully',
                message: 'Your message has been received. We will get back to you soon!',
            });
            setFormData({
                name: "",
                email: "",
                category: "Technical Support",
                subject: "",
                message: "",
            });
        } catch (error: any) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                setAlertState({
                    variant: 'error',
                    title: 'Submission Failed',
                    message: 'Something went wrong. Please try again.',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-grow pt-32 pb-20 px-4 relative z-10 w-full flex flex-col">
            <div className="max-w-xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Contact Our Team
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Have a question or need assistance? We're here to help.
                    </p>
                </div>

                {alertState && (
                    <Alert
                        variant={alertState.variant}
                        title={alertState.title}
                        message={alertState.message}
                    />
                )}

                <div className="bg-white px-8 py-10 shadow-2xl rounded-[2.5rem] dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="name" className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Name</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    id="name" 
                                    required 
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border-gray-200 bg-gray-50/50 px-5 py-4 text-sm text-gray-900 transition focus:ring-brand-500 focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                />
                                {errors.name && <p className="mt-1 text-[10px] text-red-500 font-bold uppercase">{errors.name[0]}</p>}
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    id="email" 
                                    required 
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border-gray-200 bg-gray-50/50 px-5 py-4 text-sm text-gray-900 transition focus:ring-brand-500 focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                />
                                {errors.email && <p className="mt-1 text-[10px] text-red-500 font-bold uppercase">{errors.email[0]}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Category</label>
                            <select 
                                name="category" 
                                id="category" 
                                required
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full rounded-2xl border-gray-200 bg-gray-50/50 px-5 py-4 text-sm text-gray-900 transition focus:ring-brand-500 focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white appearance-none"
                            >
                                <option value="Technical Support">Technical Support</option>
                                <option value="Legal Inquiry">Legal Inquiry</option>
                                <option value="Partnership">Partnership</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="subject" className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Subject</label>
                            <input 
                                type="text" 
                                name="subject" 
                                id="subject" 
                                required 
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full rounded-2xl border-gray-200 bg-gray-50/50 px-5 py-4 text-sm text-gray-900 transition focus:ring-brand-500 focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            />
                            {errors.subject && <p className="mt-1 text-[10px] text-red-500 font-bold uppercase">{errors.subject[0]}</p>}
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Message</label>
                            <textarea 
                                name="message" 
                                id="message" 
                                rows={4} 
                                required
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full rounded-2xl border-gray-200 bg-gray-50/50 px-5 py-4 text-sm text-gray-900 transition focus:ring-brand-500 focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white resize-none"
                            ></textarea>
                            {errors.message && <p className="mt-1 text-[10px] text-red-500 font-bold uppercase">{errors.message[0]}</p>}
                        </div>

                        <div>
                            <button 
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center rounded-2xl bg-brand-500 px-4 py-5 text-sm font-bold text-white shadow-xl shadow-brand-500/30 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
                            >
                                {loading ? "Sending..." : "Send Message"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
