import { User, Report, Message } from './Types';

/**
 * Mock Users Database
 * Pre-configured users for testing
 */
export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    email: 'admin@forensic.com',
    firstName: 'Admin',
    lastName: 'User',
    createdAt: new Date('2025-01-15'),
  },
  {
    id: 'user-2',
    email: 'user@forensic.com',
    firstName: 'John',
    lastName: 'Analyst',
    createdAt: new Date('2025-02-20'),
  },
  {
    id: 'user-3',
    email: 'jane@forensic.com',
    firstName: 'Jane',
    lastName: 'Smith',
    createdAt: new Date('2025-03-10'),
  },
  {
    id: 'user-4',
    email: 'mike@forensic.com',
    firstName: 'Mike',
    lastName: 'Johnson',
    createdAt: new Date('2025-04-05'),
  },
  {
    id: 'user-5',
    email: 'sarah@forensic.com',
    firstName: 'Sarah',
    lastName: 'Williams',
    createdAt: new Date('2025-05-12'),
  },
];

/**
 * Sample Chat Messages
 */
const createSampleMessages = (reportId: string): Message[] => {
  const messageSets: { [key: string]: Message[] } = {
    'report-1': [
      {
        id: 'msg-1-1',
        role: 'user',
        content: 'Analyze this crime scene photo for potential evidence.',
        imageUri: 'https://picsum.photos/800/600?random=1',
        timestamp: new Date('2025-10-25T14:30:00'),
      },
      {
        id: 'msg-1-2',
        role: 'assistant',
        content: 'I can identify several key pieces of evidence in this scene. There appears to be a potential fingerprint on the glass surface, some fiber traces on the carpet, and what looks like a bloodstain pattern on the wall. The lighting suggests this photo was taken during daylight hours.',
        timestamp: new Date('2025-10-25T14:30:15'),
      },
      {
        id: 'msg-1-3',
        role: 'user',
        content: 'What can you tell me about the bloodstain pattern?',
        timestamp: new Date('2025-10-25T14:32:00'),
      },
      {
        id: 'msg-1-4',
        role: 'assistant',
        content: 'The bloodstain pattern appears to be a medium-velocity impact spatter, typically associated with blunt force trauma. The directionality of the droplets suggests the impact occurred approximately 3-4 feet from the wall surface. I recommend documenting this with high-resolution photography and measuring the individual stain diameters for trajectory analysis.',
        timestamp: new Date('2025-10-25T14:32:20'),
      },
    ],
    'report-2': [
      {
        id: 'msg-2-1',
        role: 'user',
        content: 'I found this weapon at the scene. Can you identify it?',
        imageUri: 'https://picsum.photos/800/600?random=2',
        timestamp: new Date('2025-10-28T09:15:00'),
      },
      {
        id: 'msg-2-2',
        role: 'assistant',
        content: 'This appears to be a kitchen knife with a serrated edge, approximately 8 inches in length. I can see what looks like biological material on the blade that should be collected for DNA analysis. The handle shows signs of fingerprint residue. Recommend immediate evidence collection before any degradation occurs.',
        timestamp: new Date('2025-10-28T09:15:18'),
      },
    ],
  };

  return messageSets[reportId] || [];
};

/**
 * Mock Reports Database
 * Sample forensic analysis reports
 */
export const MOCK_REPORTS: Report[] = [
  {
    id: 'report-1',
    caseId: 'CASE-2025-0001',
    userId: 'user-1',
    timestamp: new Date('2025-10-25T14:30:00'),
    images: [
      {
        uri: 'https://picsum.photos/800/600?random=1',
        uploadedAt: new Date('2025-10-25T14:30:00'),
      },
    ],
    chatHistory: createSampleMessages('report-1'),
    reportContent: 'Forensic Analysis Report\n\nCase ID: CASE-2025-0001\nDate: October 25, 2025\n\nEvidence Summary:\nThe crime scene analysis revealed several critical pieces of evidence including fingerprints, fiber traces, and bloodstain patterns. The medium-velocity impact spatter on the wall suggests blunt force trauma occurred approximately 3-4 feet from the surface.\n\nRecommendations:\n- High-resolution photography of all bloodstain patterns\n- Collection of fiber samples for lab analysis\n- Fingerprint lifting from glass surfaces\n- DNA analysis of biological material\n\nConclusion:\nThe evidence suggests a violent altercation occurred at this location. Further laboratory analysis is required to identify suspects.',
    evidenceTags: ['blood', 'fingerprint', 'fibers'],
    summary: 'Crime scene analysis revealing fingerprints, fiber traces, and medium-velocity impact blood spatter suggesting blunt force trauma.',
    status: 'completed',
  },
  {
    id: 'report-2',
    caseId: 'CASE-2025-0002',
    userId: 'user-1',
    timestamp: new Date('2025-10-28T09:15:00'),
    images: [
      {
        uri: 'https://picsum.photos/800/600?random=2',
        uploadedAt: new Date('2025-10-28T09:15:00'),
      },
    ],
    chatHistory: createSampleMessages('report-2'),
    reportContent: 'Forensic Weapon Analysis\n\nCase ID: CASE-2025-0002\nDate: October 28, 2025\n\nWeapon Description:\nSerrated kitchen knife, approximately 8 inches in length. Biological material present on blade surface. Visible fingerprint residue on handle.\n\nEvidence Collection:\n- DNA swab of blade material\n- Fingerprint lifting from handle\n- Photographic documentation\n- Measurements and specifications\n\nRecommendations:\nImmediate laboratory submission for DNA and fingerprint analysis.',
    evidenceTags: ['weapon', 'biological', 'fingerprint'],
    summary: 'Kitchen knife with biological material and fingerprint residue recovered from scene.',
    status: 'completed',
  },
  {
    id: 'report-3',
    caseId: 'CASE-2025-0003',
    userId: 'user-2',
    timestamp: new Date('2025-10-30T16:45:00'),
    images: [
      {
        uri: 'https://picsum.photos/800/600?random=3',
        uploadedAt: new Date('2025-10-30T16:45:00'),
      },
    ],
    chatHistory: [],
    reportContent: 'Vehicle Evidence Analysis\n\nCase ID: CASE-2025-0003\nDate: October 30, 2025\n\nVehicle Information:\nTire track impressions found at scene. Pattern suggests heavy vehicle, possibly SUV or truck. Tread depth indicates recent tire replacement.\n\nAnalysis:\n- Tire track measurements documented\n- Cast impressions created\n- Tread pattern photographed\n- Database comparison recommended',
    evidenceTags: ['vehicle', 'trace'],
    summary: 'Tire track impressions from heavy vehicle documented and cast for analysis.',
    status: 'completed',
  },
  {
    id: 'report-4',
    caseId: 'CASE-2025-0004',
    userId: 'user-2',
    timestamp: new Date('2025-11-01T11:20:00'),
    images: [
      {
        uri: 'https://picsum.photos/800/600?random=4',
        uploadedAt: new Date('2025-11-01T11:20:00'),
      },
      {
        uri: 'https://picsum.photos/800/600?random=5',
        uploadedAt: new Date('2025-11-01T11:22:00'),
      },
    ],
    chatHistory: [],
    reportContent: 'Document Examination Report\n\nCase ID: CASE-2025-0004\nDate: November 1, 2025\n\nDocument Analysis:\nHandwritten note recovered from scene. Ink analysis shows blue ballpoint pen. Handwriting shows signs of pressure and urgency. Potential fingerprints visible on paper edges.\n\nRecommendations:\n- Handwriting comparison analysis\n- Fingerprint development using ninhydrin\n- Ink analysis for age determination',
    evidenceTags: ['document', 'fingerprint', 'trace'],
    summary: 'Handwritten note with potential fingerprints and distinctive writing characteristics.',
    status: 'completed',
  },
  {
    id: 'report-5',
    caseId: 'CASE-2025-0005',
    userId: 'user-3',
    timestamp: new Date('2025-11-01T14:00:00'),
    images: [
      {
        uri: 'https://picsum.photos/800/600?random=6',
        uploadedAt: new Date('2025-11-01T14:00:00'),
      },
    ],
    chatHistory: [],
    reportContent: 'Digital Evidence Analysis\n\nCase ID: CASE-2025-0005\nDate: November 1, 2025\n\nDigital Device:\nSmartphone recovered from scene. Device locked but shows recent activity. Screen damage indicates possible struggle.\n\nNext Steps:\n- Forensic imaging of device\n- Password bypass procedures\n- Communication records extraction\n- Location data analysis',
    evidenceTags: ['digital', 'trace'],
    summary: 'Smartphone with screen damage and recent activity logs requiring forensic extraction.',
    status: 'draft',
  },
  {
    id: 'report-6',
    caseId: 'CASE-2025-0006',
    userId: 'user-3',
    timestamp: new Date('2025-11-02T08:30:00'),
    images: [
      {
        uri: 'https://picsum.photos/800/600?random=7',
        uploadedAt: new Date('2025-11-02T08:30:00'),
      },
    ],
    chatHistory: [],
    reportContent: 'Tool Mark Analysis\n\nCase ID: CASE-2025-0006\nDate: November 2, 2025\n\nTool Marks:\nPry marks on door frame consistent with screwdriver or similar tool. Marks show distinctive pattern that may match suspect tools.\n\nAnalysis:\n- Cast impressions created\n- Measurements documented\n- Comparison microscopy recommended\n- Tool database search initiated',
    evidenceTags: ['tool mark', 'trace'],
    summary: 'Pry marks on door frame with distinctive pattern for tool comparison.',
    status: 'completed',
  },
  {
    id: 'report-7',
    caseId: 'CASE-2025-0007',
    userId: 'user-4',
    timestamp: new Date('2025-10-15T10:15:00'),
    images: [
      {
        uri: 'https://picsum.photos/800/600?random=8',
        uploadedAt: new Date('2025-10-15T10:15:00'),
      },
    ],
    chatHistory: [],
    reportContent: 'Fiber Evidence Report\n\nCase ID: CASE-2025-0007\nDate: October 15, 2025\n\nFiber Analysis:\nMultiple colored fibers recovered from victim\'s clothing. Fibers appear synthetic, possibly from carpet or upholstery material.\n\nRecommendations:\n- Microscopic analysis\n- Chemical composition testing\n- Comparison with suspect vehicle interior\n- Database matching for fiber type',
    evidenceTags: ['fibers', 'trace'],
    summary: 'Synthetic fibers recovered from clothing requiring laboratory analysis.',
    status: 'completed',
  },
  {
    id: 'report-8',
    caseId: 'CASE-2025-0008',
    userId: 'user-4',
    timestamp: new Date('2025-10-20T13:45:00'),
    images: [
      {
        uri: 'https://picsum.photos/800/600?random=9',
        uploadedAt: new Date('2025-10-20T13:45:00'),
      },
    ],
    chatHistory: [],
    reportContent: 'Biological Evidence Collection\n\nCase ID: CASE-2025-0008\nDate: October 20, 2025\n\nBiological Samples:\nBlood samples collected from multiple locations. Saliva trace on drinking glass. Hair samples recovered from scene.\n\nProcessing:\n- DNA extraction initiated\n- Sample preservation protocols followed\n- Chain of custody documented\n- CODIS submission prepared',
    evidenceTags: ['biological', 'trace'],
    summary: 'Multiple biological samples including blood, saliva, and hair for DNA analysis.',
    status: 'completed',
  },
  {
    id: 'report-9',
    caseId: 'CASE-2025-0009',
    userId: 'user-5',
    timestamp: new Date('2025-10-22T15:30:00'),
    images: [
      {
        uri: 'https://picsum.photos/800/600?random=10',
        uploadedAt: new Date('2025-10-22T15:30:00'),
      },
    ],
    chatHistory: [],
    reportContent: 'Latent Print Analysis\n\nCase ID: CASE-2025-0009\nDate: October 22, 2025\n\nFingerprint Evidence:\nMultiple latent prints developed using powder technique. Clear ridge detail visible on glass and metal surfaces.\n\nAnalysis:\n- High-resolution photography completed\n- AFIS submission prepared\n- Quality assessment: Excellent\n- Comparison potential: High',
    evidenceTags: ['fingerprint'],
    summary: 'High-quality latent fingerprints recovered from glass and metal surfaces.',
    status: 'completed',
  },
  {
    id: 'report-10',
    caseId: 'CASE-2025-0010',
    userId: 'user-5',
    timestamp: new Date('2025-11-02T09:00:00'),
    images: [
      {
        uri: 'https://picsum.photos/800/600?random=11',
        uploadedAt: new Date('2025-11-02T09:00:00'),
      },
    ],
    chatHistory: [],
    reportContent: 'Ballistic Evidence Report\n\nCase ID: CASE-2025-0010\nDate: November 2, 2025\n\nBallistic Analysis:\nShell casing recovered from scene. Caliber identified as 9mm. Ejection pattern suggests semi-automatic firearm.\n\nRecommendations:\n- NIBIN database submission\n- Comparison microscopy if weapon recovered\n- Trajectory analysis from scene photographs\n- Additional scene search for projectiles',
    evidenceTags: ['weapon', 'trace'],
    summary: '9mm shell casing with distinctive markings for ballistic database comparison.',
    status: 'draft',
  },
];

/**
 * Evidence Tags
 * Predefined categories for evidence classification
 */
export const EVIDENCE_TAGS = [
  'weapon',
  'blood',
  'fingerprint',
  'vehicle',
  'document',
  'trace',
  'biological',
  'digital',
  'tool mark',
  'fibers',
] as const;

/**
 * Sample AI Responses
 * Mock responses for different types of queries
 */
export const AI_RESPONSES = {
  identify: [
    'Based on the image analysis, I can identify several potential pieces of evidence. The primary focus should be on documenting any visible fingerprints, trace materials, and biological evidence.',
    'This appears to be a significant piece of evidence. I recommend immediate documentation through high-resolution photography and proper evidence collection procedures.',
    'The image shows multiple points of interest that require further investigation. Each should be catalogued separately and submitted for laboratory analysis.',
  ],
  analyze: [
    'The forensic analysis suggests this evidence could be crucial to the investigation. The pattern and characteristics visible indicate professional collection and preservation protocols should be followed.',
    'From a forensic perspective, this evidence demonstrates several key characteristics that warrant detailed examination. I recommend consulting with specialists in this particular evidence type.',
    'The analytical review of this evidence reveals important details that could establish timeline and sequence of events. Proper chain of custody documentation is essential.',
  ],
  scene: [
    'The scene reconstruction based on this evidence suggests a specific sequence of events. The positioning and condition of items indicate the timeline and potential suspect behavior patterns.',
    'Scene analysis reveals multiple interaction points that should be individually documented and processed. The overall layout suggests intentional positioning of certain elements.',
    'Based on crime scene reconstruction principles, this evidence placement is consistent with specific types of criminal activity. Additional scene photography from multiple angles is recommended.',
  ],
  default: [
    'I\'ve analyzed the submitted evidence. Please provide more specific details about what aspects you\'d like me to focus on for the forensic analysis.',
    'The evidence has been reviewed. For a more comprehensive analysis, please specify particular characteristics or features you\'d like examined in detail.',
    'Thank you for submitting this evidence. I can provide detailed analysis on specific aspects - please let me know your primary areas of concern.',
  ],
};
