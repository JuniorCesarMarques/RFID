import { useEffect, useState } from "react";
import {
  DimensionValue,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ModalGenerico({
  onOpen,
  children,
  modalState,
  onClose,
  height,
  width,
  basedOnKeyboard,
}: {
  onOpen?: () => void;
  onClose: () => void;
  modalState: boolean;
  children: React.ReactNode;
  height: DimensionValue;
  width: DimensionValue;
  basedOnKeyboard?: boolean;
}) {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardOpen(true);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardOpen(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <Modal 
    onShow={() => onOpen?.()} 
    transparent 
    visible={modalState}
    >
      <View
        style={[
          styles.modalContainer,
          basedOnKeyboard ? {
            justifyContent: isKeyboardOpen ? "flex-start" : "center",
          } : {justifyContent: "center"},
        ]}
      >
        <View style={[styles.modal, { width, height }]}>
          <TouchableOpacity
            onPress={() => {
              onClose();
            }}
            style={styles.closeButton}
          >
            <Text style={{ color: "white", fontWeight: "bold", flex: 1 }}>
              X
            </Text>
          </TouchableOpacity>
            {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    padding: 16,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 12,
    alignSelf: "center",
    paddingTop: 40,
    paddingHorizontal: 40
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
    backgroundColor: "red",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
