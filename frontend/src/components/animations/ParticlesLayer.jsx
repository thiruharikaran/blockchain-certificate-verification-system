import Particles from "react-tsparticles";

function ParticlesLayer() {
  return (
    <Particles
      className="particles"
      options={{
        background: {
          color: "transparent",
        },

        particles: {
          number: {
            value: 80,
          },

          size: {
            value: {
              min: 1,
              max: 2,
            },
          },

          move: {
            enable: true,
            speed: 0.3,
          },

          links: {
            enable: true,
            opacity: 0.2,
            color: "#3b82f6",
          },

          opacity: {
            value: 0.5,
            animation: {
              enable: true,
              speed: 0.5,
              minimumValue: 0.2,
            },
          },

          color: {
            value: "#3b82f6",
          },
        },
      }}
    />
  );
}

export default ParticlesLayer;
