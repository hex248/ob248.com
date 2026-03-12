import { ProjectPage } from "@/components/ProjectPage";

export const metadata = {
  title: "The Shape of Sound",
  description:
    "A practice-led project exploring a visual approach to audio synthesis through interactive shape manipulation.",
  date: "April 2026",
  slug: "tsos",
  image: "/tsos.svg",
  url: "https://tsos.ob248.com",
  hidden: false,
  tags: ["Web", "React", "TypeScript", "Music", "Audio Synthesis", "3D"],
  type: "personal",
  github: "https://github.com/hex248/tsos",
};

export function TsosProject() {
  return (
    <ProjectPage metadata={metadata}>
      <p className="mb-4 text-pretty">
        The Shape of Sound is a practice-led project exploring a visual approach
        to audio synthesis through interactive shape manipulation.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-muted p-4 rounded">
          <h2 className="text-lg text-green-500 mb-2 text-balance">
            What is the problem?
          </h2>
          <p className="text-pretty">
            Beginner producers are overwhelmed with buttons and dials, without
            any explanation. They must learn complex concepts before getting
            started with creative expression, causing friction and fatigue.
            <br />
            <br />
            Experienced Producers often find themselves in a creative rut, using
            the same presets and settings without exploring new possibilities.
            The abundance of options can lead to decision paralysis, hindering
            creativity and experimentation.
          </p>
        </div>
        <div className="bg-muted p-4 rounded">
          <h2 className="text-lg text-green-500 mb-2 text-balance">
            What is the solution?
          </h2>
          <p className="text-pretty">
            The Shape of Sound provides a visual interface that translates audio
            parameters into interactive shapes, making the process more
            accessible and engaging for beginners.
            <br />
            <br />
            For experienced producers, it offers a fresh perspective on sound
            design, encouraging exploration and creativity by visualizing audio
            parameters in an intuitive way.
          </p>
        </div>
        <div className="bg-muted p-4 rounded">
          <h2 className="text-lg text-green-500 mb-2 text-balance">Features</h2>
          <ul className="list-disc list-inside space-y-1 text-pretty">
            <li>Visual representation of audio parameters as shapes</li>
            <li>Play notes directly on your keyboard</li>
            <li>Interactive manipulation of shapes to control sound</li>
            <li>Real-time audio synthesis and feedback</li>
            <li>Export functionality for saving creations</li>
          </ul>
        </div>
        <div className="bg-muted p-4 rounded">
          <h2 className="text-lg text-green-500 mb-2 text-balance">Stack</h2>
          <ul className="list-disc list-inside space-y-1 text-pretty">
            <li>React</li>
            <li>TypeScript</li>
            <li>Web Audio API</li>
            <li>Tone.js</li>
            <li>Three.js</li>
            <li>Vite</li>
          </ul>
        </div>
      </div>
    </ProjectPage>
  );
}
