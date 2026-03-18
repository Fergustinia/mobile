import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export type MenuItem = {
  id: string;
  label: string;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
};

interface ResumeMenuProps {
  visible: boolean;
  onClose: () => void;
  items: MenuItem[];
}

export const ResumeMenu: React.FC<ResumeMenuProps> = ({
  visible,
  onClose,
  items,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.menuContainer}>
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              {index > 0 && <View style={styles.separator} />}
              
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  item.destructive && styles.destructiveItem,
                  item.disabled && styles.disabledItem,
                ]}
                onPress={() => {
                  item.onPress();
                  onClose();
                }}
                disabled={item.disabled}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.menuItemText,
                    item.destructive && styles.destructiveText,
                    item.disabled && styles.disabledText,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    minWidth: 200,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  destructiveItem: {
  },
  destructiveText: {
    color: '#FF3B30',
  },
  disabledItem: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#8E8E93',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 16,
  },
});