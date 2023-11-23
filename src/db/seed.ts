import { prisma } from "./prisma";
import { hashPassword } from "../utils/passwordUtils";

async function main() {
  const hashedPassword = await hashPassword("Eureka@1996");
  const rishabh = await prisma.user.upsert({
    where: { email: "rishabh.6542@gmail.com" },
    update: {},
    create: {
      email: "rishabh.6542@gmail.com",
      name: "Rishabh Kumar",
      role: "Admin",
      password: hashedPassword,
      post: {
        create: {
          title:
            "AI in Education: Making Information More Accessible or Less Reliable?",
          content:
            "It’s back-to-school season, a time filled with brewing anticipation for new beginnings. With this upcoming school year comes a heated debate: AI’s role in the classroom. The dialogue surrounding the emergence of AI in education is marked by a 50/50 mix of enthusiasm and caution. While some universities have excitedly embraced AI-focused courses, curriculum, and programs to enhance the learning experience, others are hesitant to accept this new technology. In an op-ed, Douglas Hofstadter, professor of cognitive science and comparative literature at Indiana University, writes: I can’t imagine the cowardly, cowed, and counterfeit-embracing mentality that it would take for a thinking human being to ask such a system to write in their place.",
          published: true,
        },
      },
    },
  });
  const rishabh2 = await prisma.user.upsert({
    where: { email: "rockerrishabh7555@gmail.com" },
    update: {},
    create: {
      email: "rockerrishabh7555@gmail.com",
      name: "Rishabh Kumar",
      password: hashedPassword,
      post: {
        create: {
          title:
            "Yes, Another One: Google Soon Launching ChatGPT Rival Called 'Gemini'",
          content:
            "The Information is reporting that Google will soon launch its long awaited LLM called Gemini to rival Open AI’s chatbot, ChatGPT. Google’s been pretty hush-hush about it but here’s what we know so far: After OpenAI’s immense success with ChatGPT, Google leaped into action.",
          published: true,
        },
      },
    },
  });
  const rishabh3 = await prisma.user.upsert({
    where: { email: "rockerrishabh1994@gmail.com" },
    update: {},
    create: {
      email: "rockerrishabh1994@gmail.com",
      name: "Rishabh Kumar",
      role: "Admin",
      password: hashedPassword,
      post: {
        createMany: {
          data: [
            {
              title: "Why Companies Are Struggling to Deploy AI",
              content:
                "S&P Global’s 2023 AI report found that 69% of surveyed organizations have at least one AI project in production.   Most orgs believe AI and machine learning projects will drive up revenue by improving the quality of their products/services along with customer satisfaction, increasing their rate of innovation – and more. Meanwhile, a third of respondents are leveraging AI instead for its potential to lower costs by identifying and resolving operational and IT inefficiencies. But here’s the kicker: Though the consensus is that AI implementation holds great promise, most aren’t optimized to do so. The number one reason why is data management, according to the report. Let’s break this down: AI relies on large volumes of data. Companies have that data, they just have it in multiple formats – from structured data to real-time data to semi-structured IT system data to unstructured rich media data. With disparate data sets, standardization becomes a major challenge. Many orgs are also struggling with insufficient IT infrastructure and data governance, making the road to AI deployment that much harder.",
              published: true,
            },
            {
              title:
                "Yikes, Internal Microsoft Data Leaked While Sharing AI Training Data",
              content:
                "Ever show someone a specific picture in your Photos album and they start swiping left and right, seeing things they weren’t supposed to? That’s kind of what happened with Microsoft last week. Their AI research team published AI training data on GitHub, a cloud-based repository where developers store and manage code. Turns out they also granted public access to 38 terabytes of sensitive information. The research team at Wiz, a cloud security startup found Microsoft’s GitHub repository, which included a URL to access and download AI models for image recognition, during a routine data exposure tracking exercise.",
              published: true,
            },
          ],
        },
      },
    },
  });
  console.log({ rishabh, rishabh2, rishabh3 });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
