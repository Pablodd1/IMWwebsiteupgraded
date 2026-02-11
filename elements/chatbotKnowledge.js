export const chatbotKnowledge = {
    company: {
        name: "Innovative Medical Wellness",
        address: "1899 NE 164th St, North Miami Beach, FL 33162",
        phone: "(305) 864-1373",
        email: "info@innovativemedicalwellness.com",
        website: "https://innovativemedicalwellness.com",
        agingBiohacking: "https://www.agingbiohacking.com/"
    },
    services: {
        exomind: {
            keywords: ["exomind", "brain", "mental", "cognitive", "depression", "anxiety", "focus", "memory", "tms", "magnetic"],
            description: "EXOMIND is a revolutionary non-invasive brain stimulation therapy using ExoTMS technology. It targets neural circuits to improve mood, focus, and emotional resilience.",
            benefits: [
                "Enhances emotional balance & mental fortitude",
                "Reduces anxiety & promotes lasting calm",
                "Ignites mental energy & cuts brain fog",
                "Restores sleep quality",
                "Supports appetite control (great after GLP-1 therapies)"
            ],
            details: "Sessions are 30 minutes, comfortable, and require no recovery time. Treatment plans typically involve 6 sessions over 3-6 weeks.",
            candidates: "Suitable for adults with mood concerns, anxiety, brain fog, sleep issues, or stress. Not for those with metal implants in the head or pregnancy.",
            link: "https://exomindmiamibeach.com/"
        },
        agingBiohacking: {
            keywords: ["aging", "biohacking", "longevity", "optimization", "youth", "life extension"],
            description: "Aging Biohacking focuses on optimizing your biology for longevity and peak performance. We use advanced therapies to slow aging and enhance vitality.",
            link: "https://www.agingbiohacking.com/"
        },
        vtone: {
            keywords: ["vtone", "v-tone", "pelvic", "incontinence", "muscle"],
            description: "V-Tone is an FDA-cleared non-invasive treatment for pelvic floor muscle strengthening. It helps with incontinence and improves quality of life.",
            link: "/v-tone"
        },
        membership: {
            keywords: ["membership", "join", "plan", "cost", "price"],
            description: "Our membership plans offer exclusive access to our wellness services at preferred rates. Please visit our clinic or contact us for detailed tier options."
        }
    },
    faqs: [
        {
            q: ["how does exomind work", "what is exomtms"],
            a: "EXOMIND uses ExoTMS, a magnetic brain stimulation technology that activates underperforming brain networks to restore emotional balance and mental clarity."
        },
        {
            q: ["is exomind safe", "side effects exomind"],
            a: "Yes, EXOMIND is non-invasive and medication-free. Most patients find it comfortable, feeling only a gentle tapping sensation."
        },
        {
            q: ["how many sessions", "how long exomind"],
            a: "A typical initial series is 6 sessions over 3-6 weeks. Each session lasts about 30 minutes."
        }
    ],
    general: {
        greetings: ["hello", "hi", "hey", "start"],
        fallback: "I can help with information about our services like Exomind, Aging Biohacking, V-Tone, and more. How can I assist you?"
    }
};
