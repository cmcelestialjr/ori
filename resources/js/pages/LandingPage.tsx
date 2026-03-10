import { researchHero } from "../assets/images";

export default function LandingPage() {
  return (
    <main className="">
      <section
        id="home"
        className="-z-50 flex min-h-screen flex-1 flex-col items-center justify-between gap-8 px-6 pt-20 pb-10 scroll-mt-24 sm:px-10 md:flex-row md:gap-0 md:px-14"
      >
        <div className="order-2 w-full md:order-1 md:w-1/2">
          <h2 className="pb-3 text-4xl font-bold text-[#070367]">
            Empowering Faculty, Enriching Lives: Research Excellence at Leyte
            Normal University
          </h2>
          <p className="text-lg text-justify">
            Leyte Normal University (LNU) fosters a vibrant research culture,
            where our esteemed faculty members are actively engaged in creating
            and sharing knowledge that addresses real-world challenges. We
            believe that faculty involvement in research is not only crucial for
            their own professional development but also vital for enriching the
            learning experience of our students and contributing to the
            advancement of society.
          </p>
        </div>
        <div className="order-1 w-full md:order-2 md:w-1/2">
          <img
            src={researchHero}
            alt="Hero"
            className="mx-auto w-full max-w-md md:float-end md:w-11/12"
          />
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="-z-50 flex min-h-screen flex-1 items-start justify-between px-6 pt-6 pb-10 scroll-mt-0 sm:px-10 md:items-center md:px-14"
      >
        <div className="w-full rounded-3xl bg-gray-50 p-4 text-lg shadow-custom md:w-auto">
          <h1 className="mb-3 text-4xl font-bold text-[#070367]">About</h1>
          <p className="text-justify">
            <span className="font-bold">
              The Office of Research and Innovation
            </span>{" "}
            is under the umbrella of the Office of Research, Innovation, and
            Extension, whose function is to uphold the status of excellence in
            research and development. Consistent with the University’s Vision
            and Mission, and cognizant of UNESCO’s thrust for Education for
            Sustainable Development and Lifelong Learning, the research endeavor
            of the university aims for the integration of knowledge and praxis
            of sustainable development in education, arts and sciences, and
            management and entrepreneurship.
          </p>
          <p className="mb-5 text-justify">
            All research endeavors move towards addressing socio-political,
            economic, cultural, and environmental issues of the 21st century. In
            addition, the office aims to establish a research culture whereby
            faculty, staff, and students undertake quality research.
            Specifically, the office is mandated:
          </p>
          <ol className="list-decimal list-outside space-y-2 rounded-lg pl-5 text-justify">
            <li className="pl-2">
              To provide a venue for faculty, students, and researchers for
              convergence.
            </li>
            <li className="pl-2">
              To act as a research coordinating center for various programs,
              projects, and activities for the university and community.
            </li>
            <li className="pl-2">
              To network, partner, and collaborate with other similar-minded
              organizations.
            </li>
            <li className="pl-2">
              To initiate creative and empowering activities that will increase
              capability, participation, and deepen awareness in research among
              faculty, students, and the community as the basis for instructing,
              forming, nurturing, and coaching young people for sustainable
              development.
            </li>
            <li className="pl-2">
              To raise the level of appreciation and understanding of the
              faculty, students, and stakeholders on issues, problems, and
              initiatives confronting their communities.
            </li>
            <li className="pl-2">
              To harness the participation and involvement of young people in
              research and community development initiatives by providing them
              venues for actual exposure to research situations.
            </li>
            <li className="pl-2">
              To build a sense of responsibility, vigilance, stewardship, and
              intellectual integrity to research.
            </li>
            <li className="pl-2">
              To link critical development issues important to target
              communities with the university's research, instruction, personal
              expertise, and external sources.
            </li>
            <li className="pl-2">
              To conduct regular monitoring and assessment of the activities
              implemented per school year.
            </li>
          </ol>
        </div>
      </section>
    </main>
  );
}
