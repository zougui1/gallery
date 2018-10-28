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

const InputChips = ({ suggestions, value, handleChange, handleFocus, handleBlur }) => {

    const Control = props => (
        <TextField
            onKeyUp={handleKeyUp}
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

    const components = {
        Control,
        Menu,
        MultiValue,
        NoOptionsMessage,
        Option,
        Placeholder,
        SingleValue,
        ValueContainer,
    };

    const handleKeyUp = e => {
        const self = e.target;
        const inputValue = self.value.trim();
        if (e.key === 'Enter') {
            handleChange([
                ...value,
                { value: inputValue, label: inputValue }
            ]);
        }
    }

    return (
        <Select
            textFieldProps={{
                label: 'Tags',
                InputLabelProps: {
                    shrink: true,
                },
            }}
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

export default InputChips;