import { useEffect, useState } from "react";
import { FaBullhorn, FaXmark } from "react-icons/fa6";
import api from "../lib/api";
import { AUTH_UPDATED_EVENT } from "../lib/auth";

const DISMISSED_ANNOUNCEMENTS_KEY = "dismissedAnnouncements";

function getDismissedAnnouncementIds() {
    try {
        const dismissed = JSON.parse(localStorage.getItem(DISMISSED_ANNOUNCEMENTS_KEY) || "[]");
        return Array.isArray(dismissed) ? dismissed : [];
    } catch {
        return [];
    }
}

export default function AnnouncementBanner() {
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        let isMounted = true;

        async function loadAnnouncements() {
            try {
                const response = await api.get("/announcements");
                const data = Array.isArray(response.data) ? response.data : response.data?.announcements || [];
                const dismissed = getDismissedAnnouncementIds();
                if (isMounted) {
                    setAnnouncements(data.filter((announcement) => !dismissed.includes(announcement._id || announcement.id)));
                }
            } catch (error) {
                console.error("Could not load announcements:", error);
            }
        }

        loadAnnouncements();
        window.addEventListener(AUTH_UPDATED_EVENT, loadAnnouncements);
        return () => {
            isMounted = false;
            window.removeEventListener(AUTH_UPDATED_EVENT, loadAnnouncements);
        };
    }, []);

    function dismissAnnouncement(announcementId) {
        const dismissed = getDismissedAnnouncementIds();
        if (!dismissed.includes(announcementId)) {
            localStorage.setItem(DISMISSED_ANNOUNCEMENTS_KEY, JSON.stringify([...dismissed, announcementId]));
        }
        setAnnouncements((current) => current.filter((announcement) => (announcement._id || announcement.id) !== announcementId));
    }

    if (announcements.length === 0) {
        return null;
    }

    return (
        <section className="announcement-stack" aria-label="Announcements">
            {announcements.map((announcement) => {
                const announcementId = announcement._id || announcement.id;
                return (
                    <article key={announcementId} className="announcement-card">
                        <div className="flex min-w-0 items-start gap-3">
                            <span className="announcement-icon" aria-hidden="true"><FaBullhorn /></span>
                            <div className="min-w-0">
                                {announcement.image && <img src={announcement.image} alt={announcement.title || "Announcement"} className="mb-3 max-h-40 w-full rounded-lg object-cover" />}
                                <h2 className="text-base font-black text-slate-950">{announcement.title}</h2>
                                <p className="mt-1 text-sm leading-6 text-slate-700">{announcement.message}</p>
                            </div>
                        </div>
                        <button type="button" onClick={() => dismissAnnouncement(announcementId)} aria-label={`Dismiss ${announcement.title}`} title="Dismiss announcement" className="announcement-close"><FaXmark /></button>
                    </article>
                );
            })}
        </section>
    );
}
