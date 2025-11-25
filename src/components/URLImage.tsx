import React from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';

type URLImageProps = { src: string } & Omit<React.ComponentProps<typeof Image>, 'image'>;

const URLImage = React.forwardRef<Konva.Image, URLImageProps>(({ src, ...rest }, ref) => {
    const [img] = useImage(src, 'anonymous');
    return <Image ref={ref as React.Ref<Konva.Image>} image={img} {...rest} />;
});

export default URLImage;
