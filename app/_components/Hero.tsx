import Image from "next/image";
import { AuthModal } from "./AuthModal";

export function Hero() {
  return (
    <section className="relative flex-col items-center justify-center py-10 lg:py-20  ">
      <div className="text-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 rounded-3xl -m-8 blur-3xl opacity-60"></div>
        <div className="relative z-10">
          <span className="text-sm text-primary font-medium tracking-tight bg-primary/10 px-4 py-2 rounded-full">
            Interoducing Calender 1.0
          </span>
          <h1 className="text-4xl mt-8 sm:text-6xl md:text-7xl lg:text-8xl font-medium leading-none bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
            Shedualing made{" "}
            <span className="block text-primary -mt-2">super easy</span>
          </h1>
          <p className="max-w-xl mx-auto mt-4 lg:text-lg text-muted-foreground ">
            Scheduling a meeting can be a pain,But we can make it easier for
            your clients to schedule meeting with you
          </p>
          <div className="mt-5 mb-12">
            <AuthModal />
          </div>
        </div>
      </div>
      <div className="relative items-center w-full py-12 mx-auto mt-12">
        <Image
          src="/Hero.JPG"
          alt=""
          width={600}
          height={600}
          className="relative object-cover w-full border rounded-lg shadow-2xl lg:rounded-2xl "
        />
      </div>
    </section>
  );
}
