"use client";
import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from "@heroui/react";
import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

type Locker = {
  _id?: string;
  number: string;
  size: "small" | "medium" | "large";
  status: "available" | "reserved" | "expired";
  price: string;
  reservedBy?: string | null;
  reservationStart?: string | null;
  reservationEnd?: string | null;
};

type LockerFormProps = {
  selected?: Locker;
  onSave: (locker: Locker) => Promise<void>;
  onCancel: () => void;
  existingLockers: Locker[];
};

const LockerForm: React.FC<LockerFormProps> = ({
  selected,
  onSave,
  onCancel,
  existingLockers,
}) => {
  const [locker, setLocker] = useState<Locker>(
    selected || { number: "", size: "small", status: "available", price: "" }
  );

  const [errors, setErrors] = useState<{ number?: string; price?: string; size?: string }>({});

  useEffect(() => {
    if (selected) {
      setLocker({
        ...selected,
        number: String(selected.number),
        price: String(selected.price),
      });
    }
  }, [selected]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocker((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSelectChange = (name: keyof Locker, value: string) => {
    setLocker((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: { number?: string; price?: string; size?: string } = {};

    if (!String(locker.number).trim()) newErrors.number = "Number is required";
    else if (!/^\d+$/.test(locker.number)) newErrors.number = "Number must be digits only";

    if (!String(locker.price).trim()) newErrors.price = "Price is required";
    else if (!/^\d+(\.\d{1,2})?$/.test(locker.price)) newErrors.price = "Price must be a valid number";

    if (!locker.size) newErrors.size = "Size is required";

    const duplicate = existingLockers.find(
      (l) => l.number === locker.number && l._id !== locker._id
    );
    if (duplicate) newErrors.number = "This locker number is already in use";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSave({ ...locker, status: "available" });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-2">
      <Input
        name="number"
        label="Number"
        value={locker.number}
        onChange={handleChange}
        required
        isInvalid={!!errors.number}
        errorMessage={errors.number}
      />
      <Input
        name="price"
        label="Price"
        value={locker.price}
        onChange={handleChange}
        required
        isInvalid={!!errors.price}
        errorMessage={errors.price}
      />
      <Select
        name="size"
        label="Size"
        selectedKeys={[locker.size]}
        isInvalid={!!errors.size}
        errorMessage={errors.size}
        onSelectionChange={(keys) =>
          handleSelectChange("size", Array.from(keys)[0] as string)
        }
      >
        {["small", "medium", "large"].map((size) => (
          <SelectItem key={size}>{size}</SelectItem>
        ))}
      </Select>

      <div className="flex gap-2 mt-2">
        <Button type="submit">Save</Button>
        <Button type="button" variant="bordered" onPress={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default function LockerPage() {
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [editing, setEditing] = useState<Locker | null>(null);
  const [viewing, setViewing] = useState<(Locker & { reservedByEmail?: string }) | null>(null);
  const [deleting, setDeleting] = useState<Locker | null>(null);

  const fetchLockers = async () => {
    const res = await fetch(`${API_URL}/lockers`, { credentials: "include" });
    const data = await res.json();
    setLockers(data);
  };

  useEffect(() => {
    fetchLockers();
  }, []);

  useEffect(() => {
    const fetchUserEmail = async () => {
      if (viewing?.reservedBy) {
        try {
          const res = await fetch(`${API_URL}/users/${viewing.reservedBy}`, {
            credentials: "include",
          });
          if (res.ok) {
            const user = await res.json();
            setViewing((prev) => prev && { ...prev, reservedByEmail: user.email });
          } else {
            setViewing((prev) => prev && { ...prev, reservedByEmail: "Unknown user" });
          }
        } catch {
          setViewing((prev) => prev && { ...prev, reservedByEmail: "Unknown user" });
        }
      }
    };
    fetchUserEmail();
  }, [viewing?.reservedBy]);

  const handleSave = async (locker: Locker) => {
    const method = locker._id ? "PUT" : "POST";
    const endpoint = locker._id
      ? `${API_URL}/lockers/${locker._id}`
      : `${API_URL}/lockers`;

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(locker),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      alert(`Error : ${error.message || "This locker number already exists !"}`);
      return;
    }

    setEditing(null);
    fetchLockers();
  };

  const confirmDelete = async () => {
    if (!deleting?._id) return;
    await fetch(`${API_URL}/lockers/${deleting._id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setDeleting(null);
    fetchLockers();
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    <div className="p-6 pt-[100px] max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Lockers Administration Panel</h1>

      <Button
        className="mb-4"
        onPress={() =>
          setEditing({ number: "", size: "small", status: "available", price: "" })
        }
      >
        + Add New Locker
      </Button>

      <div className="grid gap-4">
        {lockers.map((locker) => (
          <Card key={locker._id} className="p-2">
            <CardBody className="grid grid-cols-2 md:grid-cols-4 gap-2 items-center">
              <div>
                <p><strong>Number:</strong> {locker.number}</p>
                <p><strong>Size:</strong> {locker.size}</p>
              </div>
              <div>
                <p><strong>Status:</strong> {locker.status}</p>
                <p><strong>Price:</strong> {locker.price}€</p>
              </div>
              <div className="col-span-2 flex gap-2 justify-end">
                <Button variant="solid" onPress={() => setViewing(locker)}>
                  View
                </Button>
                <Button onPress={() => setEditing(locker)}>Edit</Button>
                <Button variant="faded" onPress={() => setDeleting(locker)}>
                  Delete
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* View Modal */}
      <Modal isOpen={!!viewing} onOpenChange={() => setViewing(null)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Locker Details</ModalHeader>
              <ModalBody className="text-sm">
                {viewing && (
                  <>
                    <p><strong>Number:</strong> {viewing.number}</p>
                    <p><strong>Size:</strong> {viewing.size}</p>
                    <p><strong>Status:</strong> {viewing.status}</p>
                    <p><strong>Price:</strong> {viewing.price}€</p>
                    <p><strong>Reserved By:</strong> {viewing.reservedByEmail || "None"}</p>
                    <p><strong>Reservation Start:</strong> {formatDate(viewing.reservationStart)}</p>
                    <p><strong>Reservation End:</strong> {formatDate(viewing.reservationEnd)}</p>
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Close</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Edit/Create Modal */}
      <Modal isOpen={!!editing} onOpenChange={() => setEditing(null)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{editing?._id ? "Edit Locker" : "Create Locker"}</ModalHeader>
              <ModalBody>
                <LockerForm
                  selected={editing!}
                  onSave={handleSave}
                  onCancel={() => setEditing(null)}
                  existingLockers={lockers}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deleting} onOpenChange={() => setDeleting(null)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Confirm Delete</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete locker <strong>{deleting?.number}</strong>?</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="bordered" onPress={onClose}>Cancel</Button>
                <Button color="danger" onPress={confirmDelete}>Delete</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
