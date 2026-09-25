import profilePhoto from "../../assets/images/profile/priyam-profile.jpg";

export default function HeroVisual() {
  return (
    <div className="hero-visual">

      <div className="hero-orbit orbit-one" />
      <div className="hero-orbit orbit-two" />

      <div className="hero-glow" />

      <div className="hero-photo-card">

        <div className="photo-label">
          <span className="status-dot" />
          AI · DATA · SOFTWARE
        </div>

        <img
          src={profilePhoto}
          alt="Priyam"
          className="hero-photo"
        />

        <div className="photo-footer">
          <span>PRIYAM</span>
          <span>BUILD / LEARN / SHIP</span>
        </div>

      </div>

      <div className="developer-avatar">

        <div className="avatar-top">
          <span>01</span>
          <span>DEVELOPER</span>
        </div>

        <div className="avatar-image-wrapper">
          <img
            src={profilePhoto}
            alt=""
            className="avatar-image"
          />
        </div>

        <div className="avatar-code">
          <span>def build():</span>
          <span>&nbsp;&nbsp;learn()</span>
          <span>&nbsp;&nbsp;create()</span>
          <span>&nbsp;&nbsp;improve()</span>
        </div>

        <div className="avatar-bottom">
          AI / ML
          <span>+</span>
          DATA
        </div>

      </div>

    </div>
  );
}