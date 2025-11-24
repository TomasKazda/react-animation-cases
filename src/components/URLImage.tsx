import { Image } from 'react-konva';
import useImage from 'use-image';

const URLImage: React.FC<{ src: string } & Omit<React.ComponentProps<typeof Image>, 'image'>> = ({ src, ...rest }) => {
    const [img] = useImage(src, 'anonymous');
    return <Image image={img} {...rest} />;
};

export default URLImage;
