/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Role,
  UserProfile,
  CampusEvent,
  ResourceItem,
  RewardItem,
  MaintenanceReport,
  RedeemedVoucher,
  PointTransaction,
  ReportPriority,
  ReportStatus,
} from './types';
import {
  INITIAL_USERS,
  INITIAL_EVENTS,
  INITIAL_RESOURCES,
  INITIAL_REWARDS,
  INITIAL_REPORTS,
} from './data/initialData';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { VoiceModal } from './components/VoiceModal';
import { QRScannerModal } from './components/QRScannerModal';
import { EcoQuizModal } from './components/EcoQuizModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { CreateActivityModal } from './components/CreateActivityModal';
import { VoucherWalletModal } from './components/VoucherWalletModal';
import { EventDetailModal } from './components/EventDetailModal';
import { WelcomeView } from './views/WelcomeView';
import { StudentHomeView } from './views/StudentHomeView';
import { FacultyHomeView } from './views/FacultyHomeView';
import { StaffMaintenanceView } from './views/StaffMaintenanceView';
import { EventsView } from './views/EventsView';
import { ResourcesView } from './views/ResourcesView';
import { RewardsStoreView } from './views/RewardsStoreView';
import { ImpactDashboardView } from './views/ImpactDashboardView';
import { CampusMapView } from './views/CampusMapView';
import { AdminView } from './views/AdminView';
import { sounds } from './utils/audio';
import confetti from 'canvas-confetti';

export default function App() {
  // Navigation & Role State
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    return localStorage.getItem('campus_green_welcomed') !== 'true';
  });
  const [activeRole, setActiveRole] = useState<Role>('STUDENT');
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [frameMode, setFrameMode] = useState<boolean>(true);

  // Entities State with LocalStorage Caching
  const [users, setUsers] = useState<Record<string, UserProfile>>(() => {
    const saved = localStorage.getItem('cg_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [events, setEvents] = useState<CampusEvent[]>(() => {
    const saved = localStorage.getItem('cg_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [resources, setResources] = useState<ResourceItem[]>(() => {
    const saved = localStorage.getItem('cg_resources');
    return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
  });

  const [rewards, setRewards] = useState<RewardItem[]>(() => {
    const saved = localStorage.getItem('cg_rewards');
    return saved ? JSON.parse(saved) : INITIAL_REWARDS;
  });

  const [reports, setReports] = useState<MaintenanceReport[]>(() => {
    const saved = localStorage.getItem('cg_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [vouchers, setVouchers] = useState<RedeemedVoucher[]>(() => {
    const saved = localStorage.getItem('cg_vouchers');
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState<PointTransaction[]>(() => {
    const saved = localStorage.getItem('cg_txs');
    return saved ? JSON.parse(saved) : [
      { id: 'tx-01', amount: 50, type: 'EARNED_EVENT', description: 'Joined Tree Plantation Drive 2026', timestamp: 'Yesterday' },
      { id: 'tx-02', amount: 50, type: 'EARNED_MAINTENANCE_SCAN', description: 'Verified Compost Bin #04 Deposit', timestamp: '2 days ago' },
    ];
  });

  // Selected Detail Event for Event Modal
  const [selectedDetailEvent, setSelectedDetailEvent] = useState<CampusEvent | null>(null);

  // Modals State
  const [showVoiceModal, setShowVoiceModal] = useState<boolean>(false);
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);
  const [showAIModal, setShowAIModal] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' | 'error' } | null>(null);

  const currentUser: UserProfile = users[activeRole] || users.STUDENT;

  // Persist State Changes
  useEffect(() => {
    localStorage.setItem('cg_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('cg_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('cg_resources', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('cg_rewards', JSON.stringify(rewards));
  }, [rewards]);

  useEffect(() => {
    localStorage.setItem('cg_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('cg_vouchers', JSON.stringify(vouchers));
  }, [vouchers]);

  useEffect(() => {
    localStorage.setItem('cg_txs', JSON.stringify(transactions));
  }, [transactions]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Adjust User Points
  const adjustPoints = (amount: number, type: string, description: string) => {
    setUsers((prev) => {
      const u = prev[activeRole];
      const newPoints = Math.max(0, u.points + amount);
      const newLifetime = amount > 0 ? u.lifetimePoints + amount : u.lifetimePoints;

      // Tier progression check
      let lvlId = 1;
      let lvlTitle = 'Eco Starter';
      let nextLvl = 500;

      if (newLifetime >= 3000) {
        lvlId = 4;
        lvlTitle = 'Carbon Neutral Leader';
        nextLvl = 5000;
      } else if (newLifetime >= 1200) {
        lvlId = 3;
        lvlTitle = 'Sustainability Pioneer';
        nextLvl = 3000;
      } else if (newLifetime >= 500) {
        lvlId = 2;
        lvlTitle = 'Green Advocate';
        nextLvl = 1200;
      }

      return {
        ...prev,
        [activeRole]: {
          ...u,
          points: newPoints,
          lifetimePoints: newLifetime,
          level: {
            id: lvlId,
            title: lvlTitle,
            minPoints: lvlId === 1 ? 0 : lvlId === 2 ? 500 : lvlId === 3 ? 1200 : 3000,
            nextLevelPoints: nextLvl,
          },
        },
      };
    });

    // Record audit transaction
    const newTx: PointTransaction = {
      id: `tx-${Date.now()}`,
      amount,
      type,
      description,
      timestamp: 'Just now',
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Event Registration Concurrency Handler
  const handleToggleEventRegistration = (eventId: string) => {
    const target = events.find((e) => e.id === eventId);
    if (!target) return;

    if (!target.isRegistered) {
      if (target.currentParticipants >= target.capacity) {
        showToast('This campus event has reached maximum capacity.', 'error');
        return;
      }

      // Concurrency increment
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId
            ? { ...e, currentParticipants: e.currentParticipants + 1, isRegistered: true }
            : e
        )
      );
      adjustPoints(target.pointsValue, 'EARNED_EVENT', `Joined Drive: ${target.title}`);
      sounds.playPointsChime();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#f59e0b'],
      });
      showToast(`Registered for ${target.title}! (+${target.pointsValue} Pts)`);

      // Update selectedDetailEvent if open
      if (selectedDetailEvent?.id === eventId) {
        setSelectedDetailEvent((prev) =>
          prev ? { ...prev, currentParticipants: prev.currentParticipants + 1, isRegistered: true } : null
        );
      }
    } else {
      // Unregister
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId
            ? { ...e, currentParticipants: Math.max(0, e.currentParticipants - 1), isRegistered: false }
            : e
        )
      );
      adjustPoints(-target.pointsValue, 'ADMIN_ADJUSTMENT', `Cancelled Drive: ${target.title}`);
      showToast(`Cancelled registration for ${target.title}.`);

      if (selectedDetailEvent?.id === eventId) {
        setSelectedDetailEvent((prev) =>
          prev ? { ...prev, currentParticipants: Math.max(0, prev.currentParticipants - 1), isRegistered: false } : null
        );
      }
    }
  };

  // Redeem Reward in Store
  const handleRedeemReward = (reward: RewardItem) => {
    if (currentUser.points < reward.pointCost) {
      showToast(`Insufficient Eco-Points. You need ${reward.pointCost} points.`, 'error');
      return;
    }
    if (reward.stock <= 0) {
      showToast('This reward is currently out of stock.', 'error');
      return;
    }

    // Atomic decrement reward stock
    setRewards((prev) =>
      prev.map((r) => (r.id === reward.id ? { ...r, stock: r.stock - 1 } : r))
    );

    // Deduct user balance
    adjustPoints(-reward.pointCost, 'REDEEMED_REWARD', `Redeemed item: ${reward.title}`);

    // Generate Voucher Code
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const claimCode = `CG-${randomHex}${Math.floor(1000 + Math.random() * 9000)}`;

    const newVoucher: RedeemedVoucher = {
      id: `vch-${Date.now()}`,
      rewardId: reward.id,
      rewardTitle: reward.title,
      claimCode,
      pointsPaid: reward.pointCost,
      redeemedAt: 'Just now',
      isClaimed: false,
      pickupLocation: reward.pickupLocation || 'Student Union Helpdesk',
    };

    setVouchers((prev) => [newVoucher, ...prev]);
    sounds.playSuccess();
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#a855f7', '#fbbf24'],
    });
    showToast(`Claim code ${claimCode} generated for ${reward.title}!`);
  };

  // Voice Maintenance Issue Submission
  const handleVoiceReportSubmit = (data: {
    location: string;
    category: string;
    description: string;
    priority: ReportPriority;
    voiceTranscript: string;
    audioUrl?: string;
    photoUrl?: string;
  }) => {
    const newReport: MaintenanceReport = {
      id: `rep-${Date.now()}`,
      location: data.location,
      category: data.category,
      description: data.description,
      priority: data.priority,
      status: 'SUBMITTED',
      reportedBy: currentUser.name,
      reportedAt: 'Just now',
      voiceMemoTranscript: data.voiceTranscript,
      audioUrl: data.audioUrl,
      photoUrl: data.photoUrl,
    };

    setReports((prev) => [newReport, ...prev]);
    adjustPoints(25, 'EARNED_MAINTENANCE_SCAN', `Dispatched voice issue at ${data.location}`);
    showToast(`Voice report dispatched to facilities queue! (+25 Pts)`);
  };

  // Hardware QR Scan Reward Handler
  const handleQRScanSuccess = (points: number, itemName: string) => {
    adjustPoints(points, 'EARNED_MAINTENANCE_SCAN', `Verified hardware scan: ${itemName}`);
    showToast(`Verified scan at ${itemName}! (+${points} Pts)`);
  };

  // Eco Quiz Complete Handler
  const handleQuizComplete = (pointsEarned: number) => {
    adjustPoints(pointsEarned, 'EARNED_CHALLENGE', 'Completed weekly Campus Eco Quiz');
    showToast(`Completed Eco Quiz! (+${pointsEarned} Pts awarded)`);
  };

  // Faculty/Admin Create Activity
  const handleCreateActivity = (
    eventData: Omit<CampusEvent, 'id' | 'currentParticipants' | 'isRegistered'>
  ) => {
    const newEvt: CampusEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      currentParticipants: 1,
      isRegistered: true,
    };
    setEvents((prev) => [newEvt, ...prev]);
    adjustPoints(30, 'EARNED_FACULTY_APPROVED', `Published Activity: ${eventData.title}`);
    showToast(`Published "${eventData.title}" to Campus Events Feed! (+30 Pts)`);
  };

  // Reset System State to Factory Seed
  const handleResetSystemData = () => {
    setUsers(INITIAL_USERS);
    setEvents(INITIAL_EVENTS);
    setResources(INITIAL_RESOURCES);
    setRewards(INITIAL_REWARDS);
    setReports(INITIAL_REPORTS);
    setVouchers([]);
    setTransactions([
      { id: 'tx-01', amount: 50, type: 'EARNED_EVENT', description: 'Joined Tree Plantation Drive 2026', timestamp: 'Yesterday' },
    ]);
    showToast('Campus Green database restored to initial seed state.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-800 flex flex-col items-center justify-center p-0 sm:p-4 font-sans antialiased select-none">
      {/* Container Frame */}
      <div
        className={`w-full transition-all duration-300 bg-slate-950 sm:rounded-[40px] shadow-2xl relative border-0 sm:border-[8px] border-slate-800 flex flex-col overflow-hidden h-[100vh] sm:h-[840px] ${
          frameMode ? 'max-w-[420px]' : 'max-w-2xl'
        }`}
      >
        {/* Device Header Bar */}
        <div className="bg-slate-950 text-slate-200 px-5 pt-3 pb-1 flex justify-between items-center text-xs font-semibold shrink-0 select-none border-b border-slate-900">
          <span className="font-mono text-[11px] text-slate-400">09:41</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-extrabold tracking-wider uppercase">
              {activeRole} MODE
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">100% ⚡</span>
        </div>

        {/* Global Toast Alert */}
        {toast && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white text-xs px-4 py-2.5 rounded-2xl shadow-2xl z-50 border border-slate-700 flex items-center gap-2 backdrop-blur-md animate-in fade-in slide-in-from-top duration-200 max-w-[90%]">
            <span className="text-emerald-400 text-sm">
              {toast.type === 'error' ? '⚠️' : '✓'}
            </span>
            <span className="font-medium text-xs text-slate-100">{toast.message}</span>
          </div>
        )}

        {/* Main Application Body */}
        {showWelcome ? (
          <WelcomeView
            selectedRole={activeRole}
            onSelectRole={(r) => setActiveRole(r)}
            onContinue={() => {
              localStorage.setItem('campus_green_welcomed', 'true');
              setShowWelcome(false);
              setCurrentTab('home');
            }}
          />
        ) : (
          <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-50">
            {/* Top Navigation Bar */}
            <Header
              user={currentUser}
              activeRole={activeRole}
              onRoleChange={(r) => {
                setActiveRole(r);
                setCurrentTab('home');
                showToast(`Switched stakeholder profile to ${r}`);
              }}
              frameMode={frameMode}
              onToggleFrameMode={() => setFrameMode(!frameMode)}
              onOpenStore={() => setCurrentTab('rewards')}
              onOpenWallet={() => setShowWalletModal(true)}
              voucherCount={vouchers.filter((v) => !v.isClaimed).length}
            />

            {/* Viewport Routing Engine */}
            <main className="flex-1 overflow-y-auto relative">
              {/* Tab: Home (Tailored per Stakeholder) */}
              {currentTab === 'home' && (
                <>
                  {activeRole === 'STUDENT' && (
                    <StudentHomeView
                      user={currentUser}
                      events={events}
                      resources={resources}
                      onNavigateTab={(tab) => setCurrentTab(tab)}
                      onOpenQRScanner={() => setShowQRModal(true)}
                      onOpenVoiceModal={() => setShowVoiceModal(true)}
                      onOpenQuiz={() => setShowQuizModal(true)}
                      onToggleDrive={handleToggleEventRegistration}
                      onSelectEventDetail={(evt) => setSelectedDetailEvent(evt)}
                      onDownloadResource={(title) => {
                        sounds.playClick();
                        showToast(`Downloaded "${title}" to device.`);
                      }}
                    />
                  )}
                  {activeRole === 'FACULTY' && (
                    <FacultyHomeView
                      user={currentUser}
                      events={events}
                      onNavigateTab={(tab) => setCurrentTab(tab)}
                      onOpenCreateActivity={() => setShowCreateModal(true)}
                      onOpenAI={() => setShowAIModal(true)}
                      onApproveStudentAction={(studentName, actionDesc) => {
                        adjustPoints(15, 'EARNED_FACULTY_APPROVED', `Approved ${studentName} for ${actionDesc}`);
                        showToast(`Approved ${studentName}'s credit for ${actionDesc}! (+15 Pts)`);
                      }}
                    />
                  )}
                  {activeRole === 'STAFF' && (
                    <StaffMaintenanceView
                      user={currentUser}
                      reports={reports}
                      onOpenQRScanner={() => setShowQRModal(true)}
                      onOpenVoiceModal={() => setShowVoiceModal(true)}
                      onUpdateReportStatus={(id, status, staffNote) => {
                        setReports((prev) =>
                          prev.map((r) =>
                            r.id === id
                              ? {
                                  ...r,
                                  status,
                                  staffNotes: staffNote || r.staffNotes,
                                }
                              : r
                          )
                        );
                        showToast(`Report updated to ${status}.`);
                      }}
                    />
                  )}
                  {activeRole === 'ADMIN' && (
                    <AdminView
                      user={currentUser}
                      rewards={rewards}
                      events={events}
                      transactions={transactions}
                      onRestockReward={(id, amt) => {
                        setRewards((prev) =>
                          prev.map((r) => (r.id === id ? { ...r, stock: r.stock + amt } : r))
                        );
                        showToast(`Restocked ${amt} units to inventory.`);
                      }}
                      onResetSystemData={handleResetSystemData}
                    />
                  )}
                </>
              )}

              {/* Tab: Campus Map */}
              {currentTab === 'map' && (
                <CampusMapView
                  onScanStation={(name, points) => {
                    handleQRScanSuccess(points, name);
                  }}
                  onReportStationIssue={(loc, cat) => {
                    setShowVoiceModal(true);
                  }}
                />
              )}

              {/* Tab: Events */}
              {currentTab === 'events' && (
                <EventsView
                  events={events}
                  onToggleRegistration={handleToggleEventRegistration}
                  canCreateEvent={activeRole === 'FACULTY' || activeRole === 'ADMIN'}
                  onOpenCreateModal={() => setShowCreateModal(true)}
                  onSelectEventDetail={(evt) => setSelectedDetailEvent(evt)}
                />
              )}

              {/* Tab: Resources */}
              {currentTab === 'resources' && (
                <ResourcesView
                  resources={resources}
                  onToggleBookmark={(id) => {
                    setResources((prev) =>
                      prev.map((r) => (r.id === id ? { ...r, bookmarked: !r.bookmarked } : r))
                    );
                  }}
                  onToggleCompleted={(id) => {
                    setResources((prev) =>
                      prev.map((r) => (r.id === id ? { ...r, completed: true } : r))
                    );
                    adjustPoints(20, 'EARNED_RESOURCE', 'Finished sustainability guide');
                    showToast('Guide completed! (+20 Eco-Points awarded)');
                  }}
                  onDownloadResource={(title) => {
                    sounds.playClick();
                    showToast(`Downloaded "${title}" to device.`);
                  }}
                />
              )}

              {/* Tab: Rewards Store */}
              {currentTab === 'rewards' && (
                <RewardsStoreView
                  user={currentUser}
                  rewards={rewards}
                  onRedeemReward={handleRedeemReward}
                  onOpenWallet={() => setShowWalletModal(true)}
                  voucherCount={vouchers.filter((v) => !v.isClaimed).length}
                />
              )}

              {/* Tab: Impact Dashboard */}
              {currentTab === 'impact' && <ImpactDashboardView />}

              {/* Tab: Admin View */}
              {currentTab === 'admin' && (
                <AdminView
                  user={currentUser}
                  rewards={rewards}
                  events={events}
                  transactions={transactions}
                  onRestockReward={(id, amt) => {
                    setRewards((prev) =>
                      prev.map((r) => (r.id === id ? { ...r, stock: r.stock + amt } : r))
                    );
                    showToast(`Restocked ${amt} units to inventory.`);
                  }}
                  onResetSystemData={handleResetSystemData}
                />
              )}
            </main>

            {/* Bottom App Navigation Bar */}
            <BottomNav
              currentTab={currentTab}
              onTabChange={(tab) => setCurrentTab(tab)}
              onOpenQuickScan={() => setShowQRModal(true)}
              onOpenAI={() => setShowAIModal(true)}
              role={activeRole}
            />
          </div>
        )}
      </div>

      {/* Global Hardware & Interactive Modals */}
      <VoiceModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        onSubmitReport={handleVoiceReportSubmit}
      />

      <QRScannerModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        onScanSuccess={handleQRScanSuccess}
      />

      <EcoQuizModal
        isOpen={showQuizModal}
        onClose={() => setShowQuizModal(false)}
        onCompleteQuiz={handleQuizComplete}
      />

      <AIAssistantModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        role={activeRole}
      />

      <CreateActivityModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateEvent={handleCreateActivity}
      />

      <VoucherWalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        vouchers={vouchers}
        onClaimVoucher={(vId) => {
          setVouchers((prev) =>
            prev.map((v) => (v.id === vId ? { ...v, isClaimed: true } : v))
          );
          showToast('Voucher verified and redeemed at campus bookstore desk!');
        }}
      />

      {/* Event Details & Digital Pass Modal */}
      <EventDetailModal
        event={selectedDetailEvent}
        isOpen={!!selectedDetailEvent}
        onClose={() => setSelectedDetailEvent(null)}
        onToggleRegistration={handleToggleEventRegistration}
        userName={currentUser.name}
      />
    </div>
  );
}
