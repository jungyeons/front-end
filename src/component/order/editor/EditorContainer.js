import { Block } from 'baseui/block';

const EditorContainer = ({ children }) => {
  return (
    <Block
      $style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#FFFFFF',
        fontFamily: 'Poppins',
      }}
    >
      {children}
    </Block>
  );
};

export default EditorContainer;
