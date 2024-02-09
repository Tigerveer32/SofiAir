import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { handleTambahProduk } from '../../../firebase'; 
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../../firebase';

