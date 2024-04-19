import React, { useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { View, Text } from 'react-native';

const Dropdown = () => {
  const [selectedValue, setSelectedValue] = useState(null);

  const options = [
    { label: 'Buyer', value: true },
    { label: 'Seller', value: false},
  ];

  return (
    <View>
      <Text>Role:</Text>
      <RNPickerSelect
        items={options}
        onValueChange={(value) => setSelectedValue(value)}
        value={selectedValue}
      />
    </View>
  );
};

export default Dropdown;