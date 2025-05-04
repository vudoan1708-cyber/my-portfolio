
import ImageGallery from "react-image-gallery";
// import stylesheet if you're not already using CSS @import
import "react-image-gallery/styles/css/image-gallery.css";

export default function ProjectImageGallery({ gallery }) {
  return <ImageGallery items={gallery} />
}
