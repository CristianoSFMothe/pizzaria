"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

import UsersTable from "@/components/dashboard/users-table";
import { User } from "@/lib/types";

interface UsersPageContentProps {
  users: User[];
}

const UsersPageContent = ({ users }: UsersPageContentProps) => {
  const shouldReduceMotion = useReducedMotion();

  const reducedContainer: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0 } },
  };

  const animatedContainer: Variants = {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
        when: "beforeChildren",
        staggerChildren: 0.18,
        delayChildren: 0.1,
      },
    },
  };

  const reducedItem: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0 } },
  };

  const animatedItem: Variants = {
    hidden: { opacity: 0, y: 24, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 180,
        damping: 20,
        mass: 0.8,
      },
    },
  };

  const containerVariants = shouldReduceMotion
    ? reducedContainer
    : animatedContainer;
  const itemVariants = shouldReduceMotion ? reducedItem : animatedItem;

  return (
    <motion.div
      className="space-y-4 sm:space-y-6"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Usuários</h1>
        <p className="mt-2 text-sm text-gray-400 sm:text-base">
          Gerencie os usuários cadastrados no sistema
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <UsersTable initialUsers={users} />
      </motion.div>
    </motion.div>
  );
};

export default UsersPageContent;
