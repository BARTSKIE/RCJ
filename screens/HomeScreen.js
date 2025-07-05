import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Modal,
  Alert,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { auth, database, ref, push, signOut } from '../FirebaseConfig';

export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('home');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [appointmentTime, setAppointmentTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    fullName: '',
    contactNumber: '',
    email: '',
    appointmentType: '',
    additionalNotes: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const appointmentTypes = [
    'Eye Check-Up',
    'Glasses Consultation',
    'Contact Lens Fitting',
    'Follow-up Check',
    'Others'
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM',
    '1:00 PM', '2:00 PM', '3:00 PM',
    '4:00 PM', '5:00 PM'
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setAppointmentDate(selectedDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setAppointmentTime(selectedTime);
    }
  };

  const handleFormChange = (name, value) => {
    setAppointmentForm({...appointmentForm, [name]: value});
  };

  const handleSubmitAppointment = async () => {
    Keyboard.dismiss();
    setIsLoading(true);
    
    // Validate required fields
    if (!appointmentForm.fullName || !appointmentForm.contactNumber || !appointmentForm.appointmentType) {
      Alert.alert('Error', 'Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const appointmentData = {
        userId: user.uid,
        fullName: appointmentForm.fullName,
        contactNumber: appointmentForm.contactNumber,
        email: appointmentForm.email || '',
        date: appointmentDate.toDateString(),
        time: appointmentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        appointmentType: appointmentForm.appointmentType,
        additionalNotes: appointmentForm.additionalNotes || '',
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      const appointmentsRef = ref(database, 'appointments');
      await push(appointmentsRef, appointmentData);

      Alert.alert('Success', 'Your appointment has been booked successfully!');
      setShowAppointmentModal(false);
      resetForm();
    } catch (error) {
      console.error('Appointment submission error:', error);
      Alert.alert('Error', 'Failed to book appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setAppointmentForm({
      fullName: '',
      contactNumber: '',
      email: '',
      appointmentType: '',
      additionalNotes: ''
    });
    setAppointmentDate(new Date());
    setAppointmentTime(new Date());
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.welcomeText}>Welcome to RCJ Optical Clinic</Text>
            
            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Working Hours</Text>
              <View style={styles.hoursItem}>
                <Ionicons name="time-outline" size={20} color="#6c5ce7" />
                <Text style={styles.hoursText}>Mon-Fri: 9AM - 7PM</Text>
              </View>
              <View style={styles.hoursItem}>
                <Ionicons name="time-outline" size={20} color="#6c5ce7" />
                <Text style={styles.hoursText}>Sat: 9AM - 5PM</Text>
              </View>
              <View style={styles.hoursItem}>
                <Ionicons name="time-outline" size={20} color="#6c5ce7" />
                <Text style={styles.hoursText}>Sun: Closed</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.bookButton}
              onPress={() => setShowAppointmentModal(true)}
            >
              <Text style={styles.bookButtonText}>Book an Appointment</Text>
            </TouchableOpacity>
          </View>
        );
      case 'contact':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            
            <View style={styles.contactCard}>
              <View style={styles.contactItem}>
                <Ionicons name="mail-outline" size={24} color="#6c5ce7" />
                <Text style={styles.contactText}>info@rcjoptical.com</Text>
              </View>
              
              <View style={styles.contactItem}>
                <Ionicons name="call-outline" size={24} color="#6c5ce7" />
                <Text style={styles.contactText}>0956 347 8586</Text>
              </View>
              
              <View style={styles.contactItem}>
                <Ionicons name="location-outline" size={24} color="#6c5ce7" />
                <Text style={styles.contactText}>Primark Double L, Rodriguez</Text>
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {renderContent()}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={[styles.navButton, activeTab === 'home' && styles.activeNavButton]}
          onPress={() => setActiveTab('home')}
        >
          <Ionicons 
            name="home-outline" 
            size={24} 
            color={activeTab === 'home' ? '#fff' : '#6c5ce7'} 
          />
          <Text style={[styles.navText, activeTab === 'home' && styles.activeNavText]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, activeTab === 'contact' && styles.activeNavButton]}
          onPress={() => setActiveTab('contact')}
        >
          <Ionicons 
            name="call-outline" 
            size={24} 
            color={activeTab === 'contact' ? '#fff' : '#6c5ce7'} 
          />
          <Text style={[styles.navText, activeTab === 'contact' && styles.activeNavText]}>Contact</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, activeTab === 'logout' && styles.activeNavButton]}
          onPress={handleLogout}
        >
          <Ionicons 
            name="log-out-outline" 
            size={24} 
            color={activeTab === 'logout' ? '#fff' : '#6c5ce7'} 
          />
          <Text style={[styles.navText, activeTab === 'logout' && styles.activeNavText]}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showAppointmentModal}
        animationType="slide"
        transparent={false}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Book an Appointment</Text>
              <TouchableOpacity onPress={() => setShowAppointmentModal(false)}>
                <Ionicons name="close-outline" size={28} color="#6c5ce7" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="John Dela Cruz"
                  value={appointmentForm.fullName}
                  onChangeText={(text) => handleFormChange('fullName', text)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Contact Number *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0956 347 8586"
                  value={appointmentForm.contactNumber}
                  onChangeText={(text) => handleFormChange('contactNumber', text)}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email (optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  value={appointmentForm.email}
                  onChangeText={(text) => handleFormChange('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Preferred Date *</Text>
                <TouchableOpacity 
                  style={styles.dateTimeButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text>{appointmentDate.toDateString()}</Text>
                  <Ionicons name="calendar-outline" size={20} color="#6c5ce7" />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={appointmentDate}
                    mode="date"
                    display="default"
                    minimumDate={new Date()}
                    onChange={handleDateChange}
                  />
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Preferred Time *</Text>
                <View style={styles.timeSlotsContainer}>
                  {timeSlots.map((slot, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.timeSlotButton,
                        appointmentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) === slot && 
                        styles.selectedTimeSlot
                      ]}
                      onPress={() => {
                        const [time, modifier] = slot.split(' ');
                        let [hours, minutes] = time.split(':');
                        hours = parseInt(hours);
                        if (modifier === 'PM' && hours < 12) hours += 12;
                        if (modifier === 'AM' && hours === 12) hours = 0;
                        
                        const newTime = new Date(appointmentTime);
                        newTime.setHours(hours);
                        newTime.setMinutes(parseInt(minutes));
                        setAppointmentTime(newTime);
                      }}
                    >
                      <Text style={styles.timeSlotText}>{slot}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Type of Appointment *</Text>
                <View style={styles.radioGroup}>
                  {appointmentTypes.map((type, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.radioButton,
                        appointmentForm.appointmentType === type && styles.radioButtonSelected
                      ]}
                      onPress={() => handleFormChange('appointmentType', type)}
                    >
                      <Text style={styles.radioButtonText}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Additional Notes (optional)</Text>
                <TextInput
                  style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                  placeholder="Special requests or details"
                  value={appointmentForm.additionalNotes}
                  onChangeText={(text) => handleFormChange('additionalNotes', text)}
                  multiline
                />
              </View>

              <TouchableOpacity 
                style={[styles.submitButton, isLoading && styles.disabledButton]}
                onPress={handleSubmitAppointment}
                disabled={isLoading}
              >
                <Text style={styles.submitButtonText}>
                  {isLoading ? 'Submitting...' : 'Confirm Appointment'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  contentContainer: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2f3640',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2f3640',
    marginBottom: 15,
  },
  hoursItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  hoursText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#2f3640',
  },
  bookButton: {
    backgroundColor: '#6c5ce7',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  contactText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#2f3640',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  activeNavButton: {
    backgroundColor: '#6c5ce7',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#6c5ce7',
  },
  activeNavText: {
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2f3640',
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2f3640',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateTimeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeSlotButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '30%',
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: '#6c5ce7',
    borderColor: '#6c5ce7',
  },
  timeSlotText: {
    color: '#2f3640',
  },
  radioGroup: {
    marginTop: 8,
  },
  radioButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  radioButtonSelected: {
    backgroundColor: '#6c5ce7',
    borderColor: '#6c5ce7',
  },
  radioButtonText: {
    color: '#2f3640',
  },
  submitButton: {
    backgroundColor: '#6c5ce7',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});