import React from 'react';
import CKEditor from 'react-ckeditor-component';
import {TextField} from '@mui/material';

class CustomCKEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: props.content || ''
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(evt) {
    const newContent = evt.editor.getData();
    this.setState({ content: newContent });

    if (this.props.onChange) {
      this.props.onChange({
        target: {
          name: this.props.name,
          value: newContent
        }
      });
    }
  }

  render() {
    const {
      label,
      onBlur,
      value,
      error,
      helperText,
      sx,
      ...rest
    } = this.props;

    return (
      <TextField
        label={label}
        onBlur={onBlur}
        value={this.state.content}
        error={Boolean(error)}
        helperText={helperText}
        sx={sx}
        {...rest}
      >
        <CKEditor
          activeClass="p10"
          content={this.state.content}
          events={{
            'change': this.onChange
          }}
        />
      </TextField>
    );
  }
}

export default CustomCKEditor;