import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import DeviceFeature from "@/components/DeviceFeature";
import HowToPlay from "@/components/HowToPlay";
import Sabotage from "@/components/Sabotage";
import MusicSelection from "@/components/MusicSelection";
import DailyTrivia from "@/components/DailyTrivia";
import EmailSignup from "@/components/EmailSignup";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />

        <DeviceFeature />

        <HowToPlay />

        <Sabotage />

        <MusicSelection />

        <DailyTrivia />

        <EmailSignup />
      </main>
      <Footer />
    </>
  );
}
