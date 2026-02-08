import { Demo } from "@/components/Demo";
import { ProjectPage } from "@/components/ProjectPage";

export const metadata = {
  title: "flackie",
  description:
    "A portable FLAC player built with C++ and Python for Raspberry Pi. Custom UI, hardware controls, e-ink display, and a 3D printed case.",
  date: "October 2025",
  slug: "flackie",
  image: "/flackie-icon.svg",
  github: "https://github.com/hex248/flackie",
  hidden: true,
  tags: [
    "Raspberry Pi",
    "Python",
    "C++",
    "CMake",
    "Electronics",
    "Pillow",
    "Image Generation",
  ],
  type: "personal",
};

export function FlackieProject() {
  return (
    <ProjectPage metadata={metadata}>
      <p className="text-pretty">
        "flackie" is a portable FLAC music player I built using a Raspberry Pi
        Zero 2 W, a small e-ink display, and some physical buttons. The device
        features a custom Python UI for browsing and playing FLAC files. The
        case was designed in CAD and 3D printed to house all the components
        neatly.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-muted p-4 rounded mt-4">
          <h2 className="text-lg text-green-500 mb-2 text-balance">
            Key features
          </h2>
          <ul className="list-disc list-inside space-y-1 text-pretty">
            <li>Portable design with a compact form factor</li>
            <li>Custom Python UI for easy navigation</li>
            <li>Physical buttons for playback control</li>
            <li>3D printed case</li>
            <li>Supports FLAC audio playback</li>
          </ul>
        </div>

        <div className="bg-muted p-4 rounded mt-4">
          <h2 className="text-lg text-green-500 mb-2 text-balance">
            Technologies
          </h2>
          <ul className="list-disc list-inside space-y-1 text-pretty">
            <li>C++</li>
            <li>CMake</li>
            <li>Python</li>
            <li>Pillow</li>
            <li>Raspberry Pi Zero 2 W</li>
            <li>E-ink display</li>
            <li>3D printing</li>
          </ul>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-2xl text-accent mb-3 text-balance">Pictures</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Demo image="/images/flackie/1.png" title="1" type="boxed" />
          <Demo image="/images/flackie/2.png" title="2" type="boxed" />
          <Demo image="/images/flackie/3.png" title="3" type="boxed" />
          <Demo image="/images/flackie/4.png" title="4" type="boxed" />
        </div>
      </div>
    </ProjectPage>
  );
}
