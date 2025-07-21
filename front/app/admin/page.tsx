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
};

const LockerForm: React.FC<LockerFormProps> = ({
  selected,
  onSave,
  onCancel,
}) => {
  const [locker, setLocker] = useState<Locker>(
    selected || {
      number: "",
      size: "small",
      status: "available",
      price: "",
    }
  );

  useEffect(() => {
    if (selected) setLocker(selected);
  }, [selected]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLocker((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(locker);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-2">
      <Input
        name="number"
        placeholder="Number"
        value={locker.number}
        onChange={handleChange}
        required
      />
      <Input
        name="price"
        placeholder="Price"
        value={locker.price}
        onChange={handleChange}
        required
      />

      <Select name="size" value={locker.size} onChange={handleChange as any}>
        {["small", "medium", "large"].map((size) => (
          <SelectItem key={size}>{size}</SelectItem>
        ))}
      </Select>

      <Select
        name="status"
        value={locker.status}
        onChange={handleChange as any}
      >
        {["available", "reserved", "expired"].map((status) => (
          <SelectItem key={status}>{status}</SelectItem>
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
  const [viewing, setViewing] = useState<Locker | null>(null);

  const fetchLockers = async () => {
    const res = await fetch(`${API_URL}/lockers`, {
      credentials: "include",
    });
    const data = await res.json();
    setLockers(data);
  };

  useEffect(() => {
    fetchLockers();
  }, []);

  const handleSave = async (locker: Locker) => {
    const method = locker._id ? "PUT" : "POST";
    const endpoint = locker._id
      ? `${API_URL}/lockers/${locker._id}`
      : `${API_URL}/lockers`;

    await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(locker),
    });

    setEditing(null);
    fetchLockers();
  };

  const handleDelete = async (id: string) => {
    await fetch(`${API_URL}/lockers/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchLockers();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Lockers Administration Panel</h1>

      <Button
        className="mb-4"
        onPress={() =>
          setEditing({
            number: "",
            size: "small",
            status: "available",
            price: "",
          })
        }
      >
        + Add New Locker
      </Button>

      <div className="grid gap-4">
        {lockers.map((locker) => (
          <Card key={locker._id} className="p-2">
            <CardBody className="grid grid-cols-2 md:grid-cols-4 gap-2 items-center">
              <div>
                <p>
                  <strong>Number:</strong> {locker.number}
                </p>
                <p>
                  <strong>Size:</strong> {locker.size}
                </p>
              </div>
              <div>
                <p>
                  <strong>Status:</strong> {locker.status}
                </p>
                <p>
                  <strong>Price:</strong> €{locker.price}
                </p>
              </div>
              <div className="col-span-2 flex gap-2 justify-end">
                <Button variant="solid" onPress={() => setViewing(locker)}>
                  View
                </Button>
                <Button onPress={() => setEditing(locker)}>Edit</Button>
                <Button
                  variant="faded"
                  onPress={() => handleDelete(locker._id!)}
                >
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
                    <p>
                      <strong>ID:</strong> {viewing._id}
                    </p>
                    <p>
                      <strong>Number:</strong> {viewing.number}
                    </p>
                    <p>
                      <strong>Size:</strong> {viewing.size}
                    </p>
                    <p>
                      <strong>Status:</strong> {viewing.status}
                    </p>
                    <p>
                      <strong>Price:</strong> €{viewing.price}
                    </p>
                    <p>
                      <strong>Reserved By:</strong>{" "}
                      {viewing.reservedBy || "None"}
                    </p>
                    <p>
                      <strong>Reservation Start:</strong>{" "}
                      {viewing.reservationStart || "N/A"}
                    </p>
                    <p>
                      <strong>Reservation End:</strong>{" "}
                      {viewing.reservationEnd || "N/A"}
                    </p>
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

      {/* Edit Modal */}
      <Modal isOpen={!!editing} onOpenChange={() => setEditing(null)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {editing?._id ? "Edit Locker" : "Create Locker"}
              </ModalHeader>
              <ModalBody>
                <LockerForm
                  selected={editing!}
                  onSave={handleSave}
                  onCancel={() => setEditing(null)}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
