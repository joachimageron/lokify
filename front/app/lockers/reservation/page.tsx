"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Divider,
  Button,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { motion } from "framer-motion";
import { ILocker, LockerSize } from "../../../../api/models/Locker";
import { useAuth } from "@/app/components/providers/AuthProvider";
import AuthGuard from "@/app/components/guards/AuthGuard";

const generateTimeSlots = () => {
  const slots = [];
  for (let h = 0; h < 24; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
  }
  return slots;
};

const LOCKER_SIZE_MAP: Record<LockerSize, number> = {
  small: 1,
  medium: 2,
  large: 3,
};

const timeSlots = generateTimeSlots();

export default function ReservationPage() {
  const [lockersData, setLockersData] = useState<ILocker[]>([]);
  const [selectedLockers, setSelectedLockers] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { user } = useAuth();

  const now = new Date();

  const toggleLockerSelection = (id: string) => {
    setSelectedLockers((prev) =>
      prev.includes(id)
        ? prev.filter((lockerId) => lockerId !== id)
        : [...prev, id]
    );
  };

  const fetchLockers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/lockers", {
        credentials: "include",
      });
      const data = await res.json();
      setLockersData(data);
    } catch (err) {
      console.error("Erreur lors du chargement des casiers :", err);
    }
  };

  useEffect(() => {
    fetchLockers();
  }, []);

  const getReturnDateTime = () => {
    if (!selectedDate || !selectedTime) return null;
    const returnDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
    return !isNaN(returnDateTime.getTime()) && returnDateTime > now
      ? returnDateTime
      : null;
  };

  const calculateTotalPrice = () => {
    const returnDateTime = getReturnDateTime();
    if (!returnDateTime) return 0;

    const diffInMs = returnDateTime.getTime() - now.getTime();
    const diffInHours = Math.ceil(diffInMs / (1000 * 60 * 60));
    if (diffInHours <= 0) return 0;

    return selectedLockers.reduce((total, lockerId) => {
      const locker = lockersData.find((l) => l._id === lockerId);
      return locker ? total + Number(locker.price) * diffInHours : total;
    }, 0);
  };

  const isValidReservation = () => !!getReturnDateTime();

  const handleSubmitReservation = async () => {
    const reservationEnd = getReturnDateTime();
    if (!reservationEnd) return;

    const reservationStart = new Date();

    try {
      for (const lockerId of selectedLockers) {
        const locker = lockersData.find((l) => l._id === lockerId);
        if (!locker) continue;

        const updatedLocker = {
          ...locker,
          status: "reserved",
          reservedBy: user?.id,
          reservationStart,
          reservationEnd,
        };

        await fetch(`http://localhost:5000/api/lockers/${lockerId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updatedLocker),
        });
      }

      setSelectedLockers([]);
      setSelectedDate("");
      setSelectedTime(null);
      await fetchLockers();
    } catch (err) {
      console.error("Erreur réseau :", err);
    }
  };

  return (
    <AuthGuard>
      <main className="flex flex-col items-center py-[130px] px-[20px] md:px-[110px] min-h-screen bg-home-img">
        <div className="flex w-full flex-col gap-4 rounded-large bg-content1 px-4 md:px-8 py-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choosing your lockers
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            Available lockers are blue. Reserved ones are red. Select by
            clicking, they will turn yellow.<br />
            You can check your selection, choose return time and see the total
            price. Max rental period is one week.
          </p>

          <div className="overflow-x-auto">
            <div
              className="grid grid-rows-3 w-fit md:px-3 py-1"
              style={{ gridAutoFlow: "column dense" }}
            >
              {lockersData.map((locker) => (
                <motion.button
                  key={locker._id}
                  className={`relative flex flex-col justify-center items-center p-4 border text-white font-bold cursor-pointer transition w-[125px] min-h-[100px] rounded-[4px] ${locker.status !== "available"
                    ? "bg-red-500 pointer-events-none"
                    : selectedLockers.includes(locker._id)
                      ? "bg-yellow-500"
                      : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  style={{ gridRow: `span ${LOCKER_SIZE_MAP[locker.size]}` }}
                  onClick={() => toggleLockerSelection(locker._id)}
                >
                  <span className="absolute top-[8px] px-[12px] bg-white text-gray-800 negative-shadow">
                    {locker.number}
                  </span>
                  <span className="locker-emoji text-xl absolute left-[10px] top-[50%] translate-y-[-50%]">
                    🔒
                  </span>
                  <span className="locker-decoration absolute left-[50%] bottom-[20px] translate-x-[-50%] w-[45%] h-[2px] bg-gray-300 rounded"></span>
                </motion.button>
              ))}
            </div>
          </div>

          {selectedLockers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-6 w-full"
            >
              <Card shadow="sm" className="rounded-none w-full">
                <CardBody className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                  <div className="border-r-2">
                    <h2 className="text-lg font-bold text-gray-800 mb-2">
                      Selected lockers
                    </h2>
                    <ul className="space-y-2">
                      {selectedLockers.map((id) => {
                        const locker = lockersData.find((l) => l._id === id);
                        return locker ? (
                          <li
                            key={id}
                            className="text-gray-700 text-md p-2 rounded-lg"
                          >
                            - Locker {locker.number} :{" "}
                            {LOCKER_SIZE_MAP[locker.size] * 80}x60cm :{" "}
                            <span className="font-medium">
                              {locker.price}€
                            </span>{" "}
                            /h
                          </li>
                        ) : null;
                      })}
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-2">
                      Date and time of return
                    </h2>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        End date
                      </label>
                      <Input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        max={
                          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                            .toISOString()
                            .split("T")[0]
                        }
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        End hour
                      </label>
                      <Select
                        placeholder="Choose a time"
                        onSelectionChange={(value) =>
                          setSelectedTime(value.currentKey ?? null)
                        }
                      >
                        {timeSlots.map((time) => (
                          <SelectItem key={time}>{time}</SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                </CardBody>

                <Divider />

                <CardFooter className="flex flex-col lg:flex-row justify-between items-center p-6">
                  <p className="text-lg font-bold text-gray-700">
                    Total :{" "}
                    <span className="text-blue-600">
                      {calculateTotalPrice().toFixed(2)} €
                    </span>
                  </p>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg rounded-lg"
                    disabled={!isValidReservation()}
                    onPress={handleSubmitReservation}
                  >
                    I confirm my reservation
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </AuthGuard>
  );
}
