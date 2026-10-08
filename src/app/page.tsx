import UI from '@/components/UI';

export default function Home() {
  return (
    <main 
      className="relative w-full h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/brujula_bg_2.jpg')" }}
    >
      <UI />
    </main>
  );
}

