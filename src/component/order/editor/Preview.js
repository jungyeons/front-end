import React from 'react';
import { Modal, ModalBody, ModalHeader, ModalButton } from 'baseui/modal';
import { Block } from 'baseui/block';
import { Radio, RadioGroup, ALIGN } from 'baseui/radio';
import { LabelSmall, HeadingXSmall } from 'baseui/typography';
import { useEditor } from '@layerhub-io/react';
import { ModalFooter } from 'react-bootstrap';
import Frame from '../../../image/icon/frame.png';
import Glow from '../../../image/icon/glow.png';
import useAppContext from '../../../hooks/useAppContext';
import mergeImages from 'merge-images';
import { resizedataURL } from '../../../utils';
import { ADDITIONAL_MATERIAL } from '../../../global/Constants';

const generateMergedImageURL = async ({ customImage, isGlow }) => {
  const images = [{ src: Frame }, { src: await resizeImage(customImage), x: 412, y: 238 }];
  if (isGlow) {
    images.push({ src: await resizeImage(Glow), x: 412, y: 238 });
  }
  return await mergeImages(images);
};

const resizeImage = async (binary) => {
  const img = document.createElement('img');
  const canvas = document.createElement('canvas');
  const resizedImageURL = await resizedataURL(img, canvas, binary, 1750, 1010).finally(
    () => img.remove() && canvas.remove(),
  );
  return resizedImageURL;
};

const Preview = ({ isOpen, setIsOpen }) => {
  const { frameOption, setFrameOption } = useAppContext();
  const editor = useEditor();
  const [loading, setLoading] = React.useState(true);
  const [additionalOption, setAdditionalOption] = React.useState(frameOption['기본소재 옵션']);
  const [state, setState] = React.useState({
    image: '',
  });

  const rollbackPreview = React.useCallback(async () => {
    if (!editor) return;

    // rollback frame background to white
    editor.frame.setBackgroundColor('#ffffff');

    // rollback opacity of objects to previous state
    editor.objects
      .list()
      .map((obj) =>
        frameOption['기본소재 옵션']?.includes('실버')
          ? (obj.opacity /= 0.65)
          : (obj.opacity /= 0.9),
      );

    setLoading(false);
  }, [editor, frameOption]);

  const makePreview = async () => {
    if (!editor) return;
    // set frame background by options
    frameOption['기본소재 옵션']?.includes('실버')
      ? editor.frame.setBackgroundColor('#9B9B9B')
      : editor.frame.setBackgroundColor('#ffffff');
    // set opacity of objects
    editor.objects
      .list()
      .map((obj) =>
        frameOption['기본소재 옵션']?.includes('실버')
          ? (obj.opacity *= 0.65)
          : (obj.opacity *= 0.9),
      );

    const template = editor.scene.exportToJSON();
    const imageURL = await editor.renderer.render(template);
    const image = await generateMergedImageURL({
      customImage: imageURL,
      isGlow: frameOption['기본소재 옵션']?.includes('유광'),
    });

    setState({ image });
    setLoading(false);
  };

  React.useEffect(() => {
    makePreview();
  }, [editor, frameOption]);

  const handleSave = React.useCallback(async () => {
    await rollbackPreview();

    const template = editor.scene.exportToJSON();
    const image = await editor.renderer.render(template);

    const a = document.createElement('a');
    a.href = image;
    a.download = 'liberty_frame_image.png';
    a.click();
    a.remove();
    setIsOpen(false);
  }, [editor]);

  const handleChangeRadio = async (e) => {
    const currentTargetValue = e.currentTarget.value;
    await rollbackPreview();
    setAdditionalOption(currentTargetValue);

    setFrameOption({
      ...frameOption,
      [`기본소재 옵션`]: currentTargetValue,
    });
  };

  return (
    <Modal
      onClose={() => setIsOpen(false) & rollbackPreview()}
      closeable
      animate
      autoFocus
      isOpen={isOpen}
      overrides={{
        DialogContainer: {
          style: {
            backdropFilter: 'blur(8px)',
          },
        },
        Dialog: {
          style: {
            width: '80vw',
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      <ModalHeader>미리보기</ModalHeader>
      <ModalBody
        $style={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: 0,
          marginLeft: 0,
          marginRight: 0,
          marginBottom: 0,
          height: '100%',
          position: 'relative',
        }}
      >
        <Block
          $style={{
            position: 'absolute',
            flex: 1,
            height: '100%',
            width: '100%',
            display: 'flex',
          }}
        >
          <Block $style={{ width: '25%', padding: '2rem' }}>
            <Block $style={{ marginBottom: '2rem' }}>
              <HeadingXSmall>기본소재 옵션</HeadingXSmall>
              <LabelSmall>옵션 적용은 주문페이지에서 해주세요</LabelSmall>
            </Block>
            <RadioGroup
              value={additionalOption}
              onChange={handleChangeRadio}
              align={ALIGN.vertical}
            >
              {ADDITIONAL_MATERIAL.map((option, idx) => (
                <Radio key={idx} value={option}>
                  {option}
                </Radio>
              ))}
            </RadioGroup>
          </Block>
          <Block
            $style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
              padding: '2rem',
            }}
          >
            {!loading && <img width='100%' height='100%' src={state.image} />}
          </Block>
        </Block>
      </ModalBody>
      <ModalFooter style={{ padding: '12px 0', margin: '24px 20px 0' }}>
        <ModalButton kind='tertiary' onClick={() => setIsOpen(false)}>
          취소
        </ModalButton>
        <ModalButton onClick={() => handleSave()}>저장하기</ModalButton>
      </ModalFooter>
    </Modal>
  );
};

export default Preview;
