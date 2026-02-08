import { Demo } from "@/components/Demo";
import { ProjectPage } from "@/components/ProjectPage";

export const metadata = {
  title: "good morning!",
  description:
    "An app for couples or friends to share daily notices with songs and photos",
  date: "October 2025",
  slug: "good-morning",
  image: "/good-morning-icon.png",
  // url: "https://gm.ob248.com",
  github: "https://github.com/hex248/good-morning",
  hidden: false,
  tags: [
    "Web",
    "React",
    "TypeScript",
    "Go",
    "PostgreSQL",
    "AWS S3",
    "Databases",
    "OAuth2",
    "Spotify API",
  ],
  type: "personal",
};

export function GoodMorningProject() {
  return (
    <ProjectPage metadata={metadata}>
      <p className="text-pretty">
        "good morning!" is a web app I built to help couples or friends share
        daily notices, songs, and photos with each other. It features a simple
        and intuitive interface for sending and receiving messages, along with
        support for photo attachments. The app is built with React and
        TypeScript on the frontend, and Go with PostgreSQL on the backend. Media
        files are stored securely using Cloudflare R2 (AWS S3).
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-muted p-4 rounded mt-4">
          <h2 className="text-lg text-green-500 mb-2 text-balance">
            Key features
          </h2>
          <ul className="list-disc list-inside space-y-1 text-pretty">
            <li>Create daily notices with photos and Spotify songs</li>
            <li>Simple user interface</li>
            <li>Google OAuth2 authentication for user accounts</li>
          </ul>
        </div>

        <div className="bg-muted p-4 rounded mt-4">
          <h2 className="text-lg text-green-500 mb-2 text-balance">
            Technologies
          </h2>
          <ul className="list-disc list-inside space-y-1 text-pretty">
            <li>React</li>
            <li>TypeScript</li>
            <li>Go</li>
            <li>PostgreSQL</li>
            <li>Cloudflare R2 (AWS S3)</li>
            <li>Spotify API</li>
            <li>OAuth2 Authentication</li>
            <li>Progressive Web App (PWA)</li>
          </ul>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-2xl text-accent mb-3 text-balance">Demo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Demo
            image="/images/good-morning/notice.png"
            title="Notice from partner"
            type="boxed"
          />
          <Demo
            image="/images/good-morning/no-notice.png"
            title="No notice from partner"
            type="boxed"
          />
          <Demo
            image="/images/good-morning/create-notice.png"
            title="Create notice"
            type="boxed"
          />
          <Demo
            image="/images/good-morning/login-with-google.png"
            title="Login with Google"
            type="boxed"
          />
          <Demo
            image="/images/good-morning/partner-pairing.png"
            title="Partner pairing"
            type="boxed"
          />
          <Demo
            image="/images/good-morning/me.png"
            title="'Me' page"
            type="boxed"
          />
        </div>
      </div>
    </ProjectPage>
  );
}
