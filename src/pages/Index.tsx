
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coffee, Users, Settings, Book, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ParentDashboard from "@/components/ParentDashboard";
import AdminDashboard from "@/components/AdminDashboard";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'parent' | 'admin' | null>(null);
  const [currentUser, setCurrentUser] = useState<string>('');
  const { toast } = useToast();

  const handleLogin = (type: 'parent' | 'admin', email: string, password: string) => {
    // Simple demo login - in real app this would be handled by Supabase auth
    if (email && password) {
      setIsLoggedIn(true);
      setUserType(type);
      setCurrentUser(email);
      toast({
        title: "Login Berhasil!",
        description: `Selamat datang ${type === 'parent' ? 'Orang Tua' : 'Admin'}`,
      });
    } else {
      toast({
        title: "Login Gagal",
        description: "Mohon isi email dan password",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setCurrentUser('');
    toast({
      title: "Logout Berhasil",
      description: "Sampai jumpa lagi!",
    });
  };

  if (isLoggedIn && userType) {
    return userType === 'parent' ? 
      <ParentDashboard user={currentUser} onLogout={handleLogout} /> : 
      <AdminDashboard user={currentUser} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-orange-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 school-gradient rounded-lg flex items-center justify-center">
                <Coffee className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sekolah Foodie</h1>
                <p className="text-sm text-gray-600">Sistem Pemesanan Makanan & Minuman</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Pesan Makanan & Minuman
            <span className="text-transparent bg-clip-text school-gradient"> Lebih Mudah</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Platform digital untuk pemesanan makanan dan minuman di sekolah. 
            Orang tua dapat memesan, admin dapat mengelola menu dengan mudah.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="card-hover border-0 shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-green-800">Untuk Orang Tua</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">Pesan makanan dan minuman untuk anak dengan mudah dan praktis</p>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-orange-800">Untuk Admin</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">Kelola menu makanan dan minuman serta pantau pesanan masuk</p>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-blue-800">Real-time</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">Pemesanan dan pengelolaan menu dalam waktu nyata</p>
            </CardContent>
          </Card>
        </div>

        {/* Login Section */}
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-900">Masuk ke Akun</CardTitle>
              <CardDescription>Pilih jenis akun Anda untuk melanjutkan</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="parent" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="parent">Orang Tua</TabsTrigger>
                  <TabsTrigger value="admin">Admin</TabsTrigger>
                </TabsList>
                
                <TabsContent value="parent">
                  <LoginForm userType="parent" onLogin={handleLogin} />
                </TabsContent>
                
                <TabsContent value="admin">
                  <LoginForm userType="admin" onLogin={handleLogin} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

const LoginForm = ({ 
  userType, 
  onLogin 
}: { 
  userType: 'parent' | 'admin';
  onLogin: (type: 'parent' | 'admin', email: string, password: string) => void;
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(userType, email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor={`${userType}-email`}>Email</Label>
        <Input
          id={`${userType}-email`}
          type="email"
          placeholder={`Masukkan email ${userType === 'parent' ? 'orang tua' : 'admin'}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${userType}-password`}>Password</Label>
        <Input
          id={`${userType}-password`}
          type="password"
          placeholder="Masukkan password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button 
        type="submit" 
        className="w-full school-gradient text-white hover:opacity-90 transition-opacity"
      >
        Masuk sebagai {userType === 'parent' ? 'Orang Tua' : 'Admin'}
      </Button>
      
      {/* Demo credentials info */}
      <div className="text-xs text-gray-500 text-center mt-2">
        <p>Demo: Gunakan email dan password apa saja untuk masuk</p>
      </div>
    </form>
  );
};

export default Index;
