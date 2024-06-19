import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from './IpAdr'; 
import {
  Box,
  Button,
  Flex,
  Stack,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  IconButton,
  Select,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { MinusIcon, AddIcon } from '@chakra-ui/icons';
import IngredientItem from './IngredientItem';

function ItemsList({ userId }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [items, setItems] = useState(location.state.items);
  const [editItemIndex, setEditItemIndex] = useState(null);
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const handleDelete = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleCamera = () => {
    navigate('/scanner');
  };

  const handleEdit = (index) => {
    const itemToEdit = items[index];
    setEditItemIndex(index);
    setItem(itemToEdit.item);
    setQuantity(itemToEdit.quantity);
    setCategory(itemToEdit.category);
    setPurchaseDate(itemToEdit.purchaseDate);
    setExpiryDate(itemToEdit.expiryDate);
    onOpen();
  };

  const handleConfirm = async () => {
    await axios.post(`${apiUrl}/upload_items/${userId}`, { items });
    navigate('/groceries');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedItems = [...items];
    updatedItems[editItemIndex] = { item, quantity, category, purchaseDate, expiryDate };
    setItems(updatedItems);
    onClose();
  };

  return (
    <Box>
      <Box 
        mt={2}   
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center"
        width="100%"
        gap="0px"
        padding="0px 0px"
      >
        {items.map((item, index) => (
          <Box
            key={index}
            onClick={() => handleEdit(index)}
            width="100%"
            cursor="pointer"
          >
            <IngredientItem 
              {...item} 
              userId={userId} 
              style={{ width: '100%', margin: 0, padding: 0 }}
            />
          </Box>
        ))}
        <Flex alignItems="center" justifyContent="space-between" display="flex" width="95%" mt={2}>
          <Button onClick={handleCamera}>Scan another receipt</Button>  
          <Button onClick={handleConfirm}>Confirm</Button>
        </Flex>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit an item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel mb={1}>Item</FormLabel>
                  <Input type="text" value={item} onChange={(e) => setItem(e.target.value)} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel mb={1}>Quantity</FormLabel>
                  <NumberInput min={0} value={quantity} onChange={valueString => setQuantity(valueString)} position="relative">
                    <NumberInputStepper position="absolute" left="0">
                      <IconButton
                        aria-label="Decrement"
                        icon={<MinusIcon />}
                        size="md"
                        onClick={() => setQuantity((prevQuantity) => (parseInt(prevQuantity || "0") > 0 ? (parseInt(prevQuantity || "0") - 1).toString() : "0"))}
                      />
                    </NumberInputStepper>
                    <NumberInputField pl="2rem" pr="2rem" paddingLeft="53px" /> {/* Adjust padding to ensure space for steppers */}
                    <NumberInputStepper position="absolute" right="4">
                      <IconButton
                        aria-label="Increment"
                        icon={<AddIcon />}
                        size="md"
                        onClick={() => setQuantity((prevQuantity) => (parseInt(prevQuantity || "0") + 1).toString())}
                      />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel mb={1}>Category</FormLabel>
                  <Select placeholder="Select category" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Vegetable">Vegetable</option>
                    <option value="Meat">Meat</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Fruit">Fruit</option>
                    <option value="Grain">Grain</option>
                    <option value="Seafood">Seafood</option>
                    <option value="Condiment">Condiment</option>
                    <option value="Dried Good">Dried Good</option>
                    <option value="Canned Food">Canned Food</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel mb={1}>Purchase Date</FormLabel>
                  <Input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel mb={1}>Expiry Date</FormLabel>
                  <Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
                </FormControl>
                <Flex mt={4} justifyContent="space-between">
                  <Button bg="#edf2f7" color="#888888" onClick={onClose}>Cancel</Button>
                  <Button colorScheme="orange" type="submit" bg="#19956d">Edit Item</Button>
                </Flex>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default ItemsList;
