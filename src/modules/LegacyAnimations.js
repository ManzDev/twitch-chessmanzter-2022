/*
const ANIMATION_OPACITY = [
  { opacity: 1 },
  { opacity: 0 }
];

const ANIMATION_VORTEX = [
  { transform: "scaleX(1)", filter: "brightness(1)" },
  { transform: "scaleX(0)", filter: "brightness(2000)" }
];

const ANIMATION_PORTAL = [
  { transform: "translateY(0%)" },
  { transform: "translateY(100%)" }
];

const ANIMATION_OPTIONS = {
  duration: 500,
  iterations: 1
};

  animation(name, direction) {
    const element = name === "portal" ? this.shadowRoot.querySelector("img") : this;
    const animationType = name === "opacity"
      ? ANIMATION_OPACITY
      : name === "portal" ? ANIMATION_PORTAL : ANIMATION_VORTEX;
    const animationOptions = direction === "enter" ? ANIMATION_OPTIONS : { ...ANIMATION_OPTIONS, direction: "reverse", fill: "forwards" };

    return new Promise((resolve, reject) => {
      const animation = element.animate(animationType, animationOptions);
      animation.onfinish = () => resolve();
    });
  }

  disappear() {
    return new Promise((resolve, reject) => {
      const animation = this.animate(ANIMATION_OPACITY, ANIMATION_OPTIONS);
      animation.onfinish = () => resolve();
    });
  }

  appears() {
    return new Promise((resolve, reject) => {
      const animation = this.animate(ANIMATION_OPACITY.reverse(), ANIMATION_OPTIONS);
      animation.onfinish = () => resolve();
    });
  }

  portalEnter() {
    return new Promise((resolve, reject) => {
      const animation = this.shadowRoot.querySelector("img").animate(ANIMATION_PORTAL, ANIMATION_OPTIONS);
      animation.onfinish = () => resolve();
    });
  }

  portalExit() {
    return new Promise((resolve, reject) => {
      const animation = this.shadowRoot.querySelector("img").animate(ANIMATION_PORTAL, { ...ANIMATION_OPTIONS, direction: "reverse" });
      animation.onfinish = () => resolve();
    });
  }
  */
