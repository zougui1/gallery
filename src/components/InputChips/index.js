import React from 'react'
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import Select from 'react-select';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import CancelIcon from '@material-ui/icons/Cancel';

const NoOptionsMessage = props =>  (
    <Typography color="textSecondary" {...props.innerProps}>
        {props.children}
    </Typography>
);

const inputComponent = ({ inputRef, ...props }) => (
    <div ref={inputRef} {...props} />
);

const Option = props => (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
);

const Placeholder = props => (
    <Typography color="textSecondary" {...props.innerProps}>
      {props.children}
    </Typography>
);

const SingleValue = props => (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
);

const ValueContainer = props => (
  <div>{props.children}</div>
);

const MultiValue = props => (
    <Chip
      tabIndex={-1}
      label={props.children}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
);

const Menu = props => (
    <Paper square {...props.innerProps}>
      {props.children}
    </Paper>
);

class InputChips extends React.Component {
    constructor(props) {
        super(props);
        const { Control } = this;
        this.components = {
            Control,
            Menu,
            MultiValue,
            NoOptionsMessage,
            Option,
            Placeholder,
            SingleValue,
            ValueContainer,
        };
    }

    Control = props => (
        <TextField
            onKeyUp={this.handleKeyUp}
            fullWidth
            InputProps={{
            inputComponent,
            inputProps: {
                inputRef: props.innerRef,
                children: props.children,
                ...props.innerProps,
            },
            }}
            {...props.selectProps.textFieldProps}
        />
    );

    handleKeyUp = e => {
        const self = e.target;
        const inputValue = self.value.trim();
        if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
            this.props.handleChange([
                ...this.props.value,
                { value: inputValue, label: inputValue }
            ]);
            e.target.blur();
            e.target.focus();
        }
    }

    render() {
        const { suggestions, value, handleBlur, handleFocus, handleChange } = this.props;
        const { components } = this;
        return (
            <Select
                options={suggestions}
                components={components}
                value={value}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Select tags"
                isMulti
            />
        );
    }
}

export default InputChips;