import { Timeline } from "../components/Timeline";
import { experiences } from "../constants";
import Reveal from "../components/Reveal";
const Experiences = () => {
  return (
    <div className="w-full">
      <Reveal direction="up" distance={40}>
        <Timeline data={experiences} />
      </Reveal>
    </div>
  );
};

export default Experiences;
