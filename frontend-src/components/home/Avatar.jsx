import { avatarArt } from "../../src/utils/art";

function Avatar({ src = "", alt = "Portrait of Shounak" }) {
  return (
    <div className="ring">
      <img
        id="avatar"
        src={src || avatarArt()}
        alt={alt}
        width="64"
        height="64"
      />
    </div>
  );
}

export default Avatar;
