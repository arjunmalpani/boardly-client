import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { createTLStore, throttle, Tldraw } from "tldraw";
import "tldraw/tldraw.css";

// --- Corrected import paths to use your project's alias ---
import { socket } from "@/lib/socket";
import { axioscall } from "@/lib/axios";
import { InviteUser } from "@/components/InviteUser"; // Import new component
import _, { isEqual, merge } from "lodash";
const initialSnapshot = {
  store: {
    "page:page": {
      id: "page:page",
      name: "Page 1",
      index: "a1",
      meta: {},
      typeName: "page",
    },
    "document:document": {
      id: "document:document",
      gridSize: 10,
      name: "",
      meta: {},
      typeName: "document",
    },
    // "instance_presence:instance_presence": {
    //   id: "instance_presence:user123",
    //   typeName: "instance_presence",
    //   userId: "user123",
    //   userName: "Alice",
    //   lastActivityTimestamp: Date.now(),
    //   color: "#1E90FF",
    //   cursor: { x: 0, y: 0, type: "default", rotation: 0 },
    //   followingUserId: null,
    //   color: "#FF6B6B",
    //   cursor: { x: 100, y: 150, type: "default", rotation: 0 },
    //   currentPageId: "page:main",
    //   selectedShapeIds: ["shape:rect1"],
    //   camera: null,
    //   screenBounds: { minX: 0, minY: 0, maxX: 800, maxY: 600 },

    // },
  },
  schema: {
    schemaVersion: 2,
    sequences: {
      "com.tldraw.store": 5,
      "com.tldraw.asset": 1,
      "com.tldraw.camera": 1,
      "com.tldraw.document": 2,
      "com.tldraw.instance": 25,
      "com.tldraw.instance_page_state": 5,
      "com.tldraw.page": 1,
      "com.tldraw.instance_presence": 6,
      "com.tldraw.pointer": 1,
      "com.tldraw.shape": 4,
      "com.tldraw.asset.bookmark": 2,
      "com.tldraw.asset.image": 5,
      "com.tldraw.asset.video": 5,
      "com.tldraw.shape.arrow": 7,
      "com.tldraw.shape.bookmark": 2,
      "com.tldraw.shape.draw": 2,
      "com.tldraw.shape.embed": 4,
      "com.tldraw.shape.frame": 1,
      "com.tldraw.shape.geo": 10,
      "com.tldraw.shape.group": 0,
      "com.tldraw.shape.highlight": 1,
      "com.tldraw.shape.image": 5,
      "com.tldraw.shape.line": 5,
      "com.tldraw.shape.note": 9,
      "com.tldraw.shape.text": 3,
      "com.tldraw.shape.video": 4,
      "com.tldraw.binding.arrow": 1,
    },
  },
};

export default function Whiteboard({ boardState }) {
  const { id: boardId } = useParams();
  const [store] = useState(() => createTLStore({}));
  //
  const componentsToHide = {
    MainMenu: null,
    PageMenu: null,
    ActionsMenu: null,
  };
  // todo: fix the bug
  //   const sendPresenceUpdate = useCallback(
  //     throttle((presence) => {
  //       // Send only presence data (camera, pointers)
  //       console.log("presece", presence); // nothing in console
  //       socket.emit("presence-update", { boardId, presence });
  //     }, 50),
  //     [boardId]
  //   );

  // --- 2. Throttled function for tiny SHAPE CHANGES (real-time) ---
  const sendShapeUpdate = useCallback(
    throttle((changes) => {
      // We MUST convert the Maps to plain Objects before sending
      const jsonChanges = JSON.parse(JSON.stringify(changes));
      socket.emit("shape-changes", { boardId, changes: jsonChanges }); // Send the plain object
    }, 50),
    [boardId]
  );

  // --- 3. Throttled function for SAVING the full snapshot ---
  const sendSnapshotForSave = useCallback(
    throttle((snapshot) => {
      // Send the full snapshot (scrubbed of presence) to be saved
      const snapshotToSend = JSON.parse(JSON.stringify(snapshot));
      for (const key in snapshotToSend.store) {
        if (
          key.startsWith("instance:") ||
          key.startsWith("instance_presence:") ||
          key.startsWith("pointer:")
        ) {
          delete snapshotToSend.store[key];
        }
      }
      socket.emit("save-snapshot", { boardId, snapshot: snapshotToSend });
    }, 3000), // Save at most every 3 seconds
    [boardId]
  );

  useEffect(() => {
    let unsubscribeDocument;
    // let unsubscribePresence;

    const snapshot = boardState;
    const mergedSnapshot = merge({}, initialSnapshot, snapshot);
    store.loadStoreSnapshot(mergedSnapshot);
    socket.connect();
    socket.emit("join-room", boardId);

    const handleDocumentChange = (change) => {
      if (change.source === "user") {
        sendShapeUpdate(change.changes);
        sendSnapshotForSave(store.getStoreSnapshot());
      }
    };
    unsubscribeDocument = store.listen(handleDocumentChange, {
      scope: "document",
    });
    // const handlePresenceChange = (change) => {
    //   console.log(store.get("instance_presence:current"));
    // };
    // unsubscribePresence = store.listen(handlePresenceChange, {
    //   scope: "presence",
    // });
    const handleShapeBroadcast = (data) => {
      const added = Object.values(data.added);

      const updatedChangePairs = Object.values(data.updated);

      const recordsToUpdate = updatedChangePairs
        .map(([oldRecord, newRecord]) => {
          const hasChanged = !_.isEqual(oldRecord, newRecord);
          return hasChanged ? newRecord : null;
        })
        .filter((record) => record !== null);

      const removed = Object.keys(data.removed);

      store.put(added);

      if (recordsToUpdate.length > 0) {
        store.put(recordsToUpdate);
      }

      store.remove(removed);
    };
    socket.on("shape-broadcast", handleShapeBroadcast);
    // const handlePresenceBroadcast = (data) => {
    //   store.put(data.presence);
    // };
    // socket.on("presence-broadcast", handlePresenceBroadcast);

    return () => {
      if (unsubscribeDocument) unsubscribeDocument();
      //   if (unsubscribePresence) unsubscribePresence();
      socket.off("shape-broadcast", handleShapeBroadcast);
      //   socket.off("presence-broadcast", handlePresenceBroadcast);
      socket.emit("leave-room", boardId);
      socket.disconnect();
    };
  }, [
    boardId,
    store,
    sendShapeUpdate,
    sendSnapshotForSave,
    // sendPresenceUpdate,
  ]);

  return (
    <div className="fixed inset-0 min-h-[calc(100vh-var(--navbar-height))] mt-16">
      <InviteUser boardId={boardId} />
      <Tldraw store={store} components={componentsToHide} />
    </div>
  );
}
